import { useEffect, useRef, useState } from "react";
import { BoardProvider, useBoard } from "./context/BoardContext.jsx";
import Header from "./components/Header.jsx";
import Toolbar from "./components/Toolbar.jsx";
import Whiteboard from "./components/Whiteboard.jsx";
import "./App.css";

function Workspace() {
  const {
    users,
    userId,
    tool,
    setTool,
    color,
    setColor,
    brushSize,
    setBrushSize,
    send
  } = useBoard();

  const [clearVersion, setClearVersion] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const boardAreaRef = useRef(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === boardAreaRef.current);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement === boardAreaRef.current) {
        await document.exitFullscreen();
      } else {
        await boardAreaRef.current?.requestFullscreen();
      }
    } catch (error) {
      console.error("Unable to toggle fullscreen mode:", error);
    }
  };

  const clearBoard = () => {
    setClearVersion((version) => version + 1);
    send({ type: "clear" });
  };

  return (
    <main className="app-shell">
      <Header users={users} userId={userId} />

      <section className="workspace">
        <div className="page-heading">
          <div>
            <p className="eyebrow">YOUR WORKSPACE</p>
            <h1>Collaborative Whiteboard</h1>
            <p className="page-description">
              A shared space to sketch, plan and create together.
            </p>
          </div>

          <div className="live-label">
            <span />
            Live collaboration
          </div>
        </div>

        {/* Only the drawing workspace enters fullscreen. The page header and footer stay out of it. */}
        <div className="board-area" ref={boardAreaRef}>
          <Toolbar
            tool={tool}
            setTool={setTool}
            color={color}
            setColor={setColor}
            brushSize={brushSize}
            setBrushSize={setBrushSize}
            onClear={clearBoard}
            onToggleFullscreen={toggleFullscreen}
            isFullscreen={isFullscreen}
          />
          <Whiteboard clearVersion={clearVersion} />
        </div>
      </section>

      <footer className="app-footer">
        <span>Collaborative Whiteboard</span>
        <span>Built with React and WebSockets</span>
      </footer>
    </main>
  );
}

export default function App() {
  return (
    <BoardProvider>
      <Workspace />
    </BoardProvider>
  );
}
