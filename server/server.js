const WebSocket = require("ws");

const PORT = process.env.PORT || 3001;
const wss = new WebSocket.Server({ port: PORT });
let nextUserId = 1;

function getUsers() {
  return Array.from(wss.clients)
    .filter((client) => client.readyState === WebSocket.OPEN)
    .map((client) => ({ id: client.userId }));
}

function broadcastUsers() {
  const message = JSON.stringify({ type: "users", users: getUsers() });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) client.send(message);
  });
}

function broadcast(data, sender) {
  wss.clients.forEach((client) => {
    if (client !== sender && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

wss.on("connection", (socket) => {
  socket.userId = nextUserId++;
  console.log(`User ${socket.userId} connected`);

  socket.send(JSON.stringify({ type: "welcome", userId: socket.userId }));
  broadcastUsers();

  socket.on("message", (rawMessage) => {
    try {
      const data = JSON.parse(rawMessage.toString());

      if (data.type === "draw") {
        const coordinates = [data.x1, data.y1, data.x2, data.y2];
        const validCoordinates = coordinates.every(
          (value) => Number.isFinite(value) && value >= 0 && value <= 1
        );
        const validColor = /^#[0-9a-fA-F]{6}$/.test(data.color);
        const validSize = Number.isFinite(data.size) && data.size >= 1 && data.size <= 60;
        const validTool = data.tool === "pen" || data.tool === "eraser";

        if (!validCoordinates || !validColor || !validSize || !validTool) return;
        broadcast(data, socket);
      } else if (data.type === "cursor") {
        if (
          !Number.isFinite(data.x) || data.x < 0 || data.x > 1 ||
          !Number.isFinite(data.y) || data.y < 0 || data.y > 1
        ) return;

        broadcast({
          type: "cursor",
          userId: socket.userId,
          x: data.x,
          y: data.y,
          name: `User ${socket.userId}`,
          color: "#3446a8"
        }, socket);
      } else if (data.type === "clear") {
        broadcast({ type: "clear" }, socket);
      }
    } catch {
      console.log("Ignored an invalid message");
    }
  });

  socket.on("close", () => {
    console.log(`User ${socket.userId} disconnected`);
    broadcast({ type: "cursor-left", userId: socket.userId }, socket);
    broadcastUsers();
  });

  socket.on("error", (error) => {
    console.error(`User ${socket.userId} socket error:`, error.message);
  });
});

wss.on("error", (error) => console.error("WebSocket server error:", error));
console.log(`Whiteboard server listening on port ${PORT}`);
