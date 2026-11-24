import { useCallback, useEffect, useRef, useState } from "react";

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:3001";

export function useCollaboration() {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [userId, setUserId] = useState(null);
  const [users, setUsers] = useState([]);
  const [cursors, setCursors] = useState({});
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const socket = new WebSocket(WS_URL);
    socketRef.current = socket;

    socket.onopen = () => setConnected(true);

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "welcome") {
          setUserId(data.userId);
        } else if (data.type === "users") {
          setUsers(data.users || []);
        } else if (data.type === "cursor") {
          setCursors((current) => ({
            ...current,
            [data.userId]: {
              x: data.x,
              y: data.y,
              name: data.name,
              color: data.color
            }
          }));
        } else if (data.type === "cursor-left") {
          setCursors((current) => {
            const next = { ...current };
            delete next[data.userId];
            return next;
          });
        } else if (data.type === "draw" || data.type === "clear") {
          setMessages((current) => [...current, { ...data, key: `${Date.now()}-${Math.random()}` }]);
        }
      } catch {
        // Ignore malformed messages from the server.
      }
    };

    socket.onerror = () => setConnected(false);
    socket.onclose = () => {
      setConnected(false);
      setUsers([]);
      setCursors({});
    };

    return () => {
      socket.close();
      socketRef.current = null;
    };
  }, []);

  const send = useCallback((data) => {
    const socket = socketRef.current;

    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(data));
      return true;
    }

    return false;
  }, []);

  return { connected, userId, users, cursors, messages, setMessages, send };
}
