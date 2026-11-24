# Collaborative Whiteboard

A React + WebSocket collaborative whiteboard for the Web Technologies course project.

## Requirements
- Node.js (LTS)
- npm

## Run locally

Open two terminals.

### 1. Start the WebSocket server
```bash
cd server
npm install
npm start
```
The server listens on `ws://localhost:3001`.

### 2. Start the React frontend
```bash
cd client
npm install
npm run dev
```
Open the local URL printed by Vite (normally http://localhost:5173).

Open the same URL in multiple tabs to test collaboration.

## Features
- Shared drawing canvas with live stroke broadcasting
- Pen, eraser, colour selection and brush size
- Live connected-user count and user avatars
- Remote cursor positions
- Collaborative clear-board action
- Responsive layout

## React concepts demonstrated
- Components and props/callbacks
- Context API and lifted shared state
- Custom hooks (`useCollaboration`, `useBoard`)
- Higher-order component (`withConnectionStatus`)
- Render props (`PointerTracker`)
- Optimistic local drawing updates

## Project structure
```text
client/
  src/
    components/
    context/
    hooks/
    patterns/
    App.jsx
    App.css
    index.css
server/
  server.js
```

Note: The whiteboard is a live session. Drawing history is not persisted when all clients disconnect or the server restarts.

## Assignment requirements checklist
- [x] React components
- [x] Props and callbacks
- [x] Shared state with Context API
- [x] Real-time cursor position updates over WebSocket
- [x] Collaborative drawing, erasing and clearing
- [x] Render props (`PointerTracker`)
- [x] Higher-order component (`withConnectionStatus`)
- [x] State lifting (`clearVersion` in `Workspace`)
- [x] Canvas API and React refs
- [x] Custom hook (`useCollaboration`)
- [x] Optimistic local drawing before sending over WebSocket
