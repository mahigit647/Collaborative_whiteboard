
import React, { useRef, useEffect, useState } from "react";
import "./App.css";

function App() {
    const canvasRef = useRef(null);
    const drawing = useRef(false);
    const previous = useRef(null);
    const socket = useRef(null);

    const [color, setColor] = useState("#0000ff");
    const [users, setUsers] = useState(0);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:3001");
        socket.current = ws;

        ws.onopen = () => {
            setConnected(true);
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                const canvas = canvasRef.current;

                if (!canvas) return;

                const ctx = canvas.getContext("2d");

                if (data.type === "users") {
                    setUsers(data.count);
                }

                if (data.type === "draw") {
                    ctx.beginPath();
                    ctx.moveTo(data.x1 * canvas.width, data.y1 * canvas.height);
                    ctx.lineTo(data.x2 * canvas.width, data.y2 * canvas.height);
                    ctx.strokeStyle = data.color;
                    ctx.lineWidth = 3;
                    ctx.stroke();
                }

                if (data.type === "clear") {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                }
            } catch (error) {
                console.log("Could not read server message");
            }
        };

        ws.onerror = () => {
            setConnected(false);
            console.log("WebSocket connection error");
        };

        ws.onclose = () => {
            setConnected(false);
            setUsers(0);
        };

        return () => {
            if (ws.readyState < WebSocket.CLOSING) {
                ws.close();
            }
        };
    }, []);

    function getPosition(e) {
        const rect = canvasRef.current.getBoundingClientRect();

        return {
            x: (e.clientX - rect.left) / rect.width,
            y: (e.clientY - rect.top) / rect.height
        };
    }

    function startDrawing(e) {
        drawing.current = true;
        previous.current = getPosition(e);
    }

    function draw(e) {
        if (!drawing.current) return;

        const pos = getPosition(e);
        const old = previous.current;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        ctx.beginPath();
        ctx.moveTo(old.x * canvas.width, old.y * canvas.height);
        ctx.lineTo(pos.x * canvas.width, pos.y * canvas.height);
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.stroke();

        if (socket.current?.readyState === WebSocket.OPEN) {
            socket.current.send(JSON.stringify({
                type: "draw",
                x1: old.x,
                y1: old.y,
                x2: pos.x,
                y2: pos.y,
                color: color
            }));
        }

        previous.current = pos;
    }

    function stopDrawing() {
        drawing.current = false;
        previous.current = null;
    }

    function clearBoard() {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (socket.current?.readyState === WebSocket.OPEN) {
            socket.current.send(JSON.stringify({ type: "clear" }));
        }
    }

    return (
        <div className="container">
            <h1>Collaborative Whiteboard</h1>

            <p>Draw together in real time!</p>

            <p>
                Connection: {connected ? "Connected" : "Disconnected"}
            </p>

            <p>Connected users: {users}</p>

            <label>Choose Drawing Colour: </label>

            <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
            />

            <canvas
                ref={canvasRef}
                width="900"
                height="550"
                onPointerDown={startDrawing}
                onPointerMove={draw}
                onPointerUp={stopDrawing}
                onPointerLeave={stopDrawing}
            />

            <button onClick={clearBoard}>Clear Board</button>
        </div>
    );
}

export default App;
