
const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 3001 });

let nextId = 1;

function updateUsers() {
    const count = wss.clients.size;

    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
                type: "users",
                count: count
            }));
        }
    });
}

wss.on("connection", (ws) => {
    const userId = nextId++;

    console.log("User connected:", userId);
    updateUsers();

    ws.on("message", (message) => {
        try {
            const data = JSON.parse(message.toString());

            if (data.type === "draw") {
                const validCoordinates = [
                    data.x1, data.y1, data.x2, data.y2
                ].every((value) =>
                    Number.isFinite(value) && value >= 0 && value <= 1
                );

                const validColor = /^#[0-9a-fA-F]{6}$/.test(data.color);

                if (!validCoordinates || !validColor) return;
            } else if (data.type !== "clear") {
                return;
            }

            wss.clients.forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(data));
                }
            });

        } catch (error) {
            console.log("Invalid message received");
        }
    });

    ws.on("close", () => {
        console.log("User disconnected:", userId);
        updateUsers();
    });

    ws.on("error", (error) => {
        console.log("Connection error:", error.message);
    });
});

wss.on("error", (error) => {
    console.log("Server error:", error.message);
});

console.log("Server running on port 3001");
