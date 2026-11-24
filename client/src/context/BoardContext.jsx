import { createContext, useContext, useState } from "react";
import { useCollaboration } from "../hooks/useCollaboration.js";

const BoardContext = createContext(null);

export function BoardProvider({ children }) {
  const [tool, setTool] = useState("pen");
  const [color, setColor] = useState("#3446a8");
  const [brushSize, setBrushSize] = useState(4);

  const collaboration = useCollaboration();

  const value = {
    tool,
    setTool,
    color,
    setColor,
    brushSize,
    setBrushSize,
    ...collaboration
  };

  return (
    <BoardContext.Provider value={value}>
      {children}
    </BoardContext.Provider>
  );
}

export function useBoard() {
  const context = useContext(BoardContext);

  if (!context) {
    throw new Error("useBoard must be used inside BoardProvider");
  }

  return context;
}
