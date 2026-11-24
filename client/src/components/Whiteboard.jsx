import { useCallback, useEffect, useRef } from "react";
import { useBoard } from "../context/BoardContext.jsx";
import PointerTracker from "../patterns/PointerTracker.jsx";
import RemoteCursors from "./RemoteCursors.jsx";

const WIDTH = 1200;
const HEIGHT = 675;

export default function Whiteboard({ clearVersion }) {
  const canvasRef = useRef(null);
  const drawingRef = useRef(false);
  const previousRef = useRef(null);
  const lastCursorSentRef = useRef(0);

  const { tool, color, brushSize, send, messages, setMessages, cursors, userId } = useBoard();

  const drawSegment = useCallback((ctx, segment, canvas) => {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(segment.x1 * canvas.width, segment.y1 * canvas.height);
    ctx.lineTo(segment.x2 * canvas.width, segment.y2 * canvas.height);
    // destination-out removes previous strokes and keeps the canvas transparent.
    ctx.globalCompositeOperation = segment.tool === "eraser" ? "destination-out" : "source-over";
    ctx.strokeStyle = segment.color || "#3446a8";
    ctx.lineWidth = segment.size || 4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    ctx.restore();
  }, []);

  useEffect(() => {
    if (clearVersion === 0) return;
    const canvas = canvasRef.current;
    if (canvas) canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
  }, [clearVersion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || messages.length === 0) return;
    const ctx = canvas.getContext("2d");

    messages.forEach((message) => {
      if (message.type === "clear") {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      } else if (message.type === "draw") {
        drawSegment(ctx, message, canvas);
      }
    });

    setMessages([]);
  }, [messages, setMessages, drawSegment]);

  const getPosition = (event) => {
    const bounds = canvasRef.current.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width)),
      y: Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height))
    };
  };

  const startDrawing = (event) => {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drawingRef.current = true;
    previousRef.current = getPosition(event);
  };

  const draw = (event) => {
    const position = getPosition(event);

    if (event.pointerType !== "touch") {
      const now = Date.now();
      if (now - lastCursorSentRef.current > 35) {
        send({
          type: "cursor",
          x: position.x,
          y: position.y,
          name: userId ? `User ${userId}` : "Guest",
          color: "#3446a8"
        });
        lastCursorSentRef.current = now;
      }
    }

    if (!drawingRef.current) return;

    const previous = previousRef.current;
    const segment = {
      x1: previous.x,
      y1: previous.y,
      x2: position.x,
      y2: position.y,
      color,
      size: tool === "eraser" ? Math.max(18, brushSize * 3) : brushSize,
      tool
    };

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    drawSegment(ctx, segment, canvas);

    // Optimistic update: the local canvas changes immediately, then the stroke is broadcast.
    send({ type: "draw", ...segment });
    previousRef.current = position;
  };

  const stopDrawing = () => {
    drawingRef.current = false;
    previousRef.current = null;
  };

  return (
    <div className="canvas-shell">
      <div className="canvas-topline">
        <span className="canvas-title">Untitled board</span>
        <span className="canvas-hint">Changes are shared in real time</span>
      </div>
      <div className="canvas-frame">
        <PointerTracker>
          {({ position, trackPointer }) => (
            <>
              <canvas
                ref={canvasRef}
                width={WIDTH}
                height={HEIGHT}
                onPointerDown={startDrawing}
                onPointerMove={(event) => { trackPointer(event); draw(event); }}
                onPointerUp={stopDrawing}
                onPointerCancel={stopDrawing}
                onLostPointerCapture={stopDrawing}
                aria-label="Collaborative drawing canvas"
              />
              <span className="pointer-readout">
                {position
                  ? `Pointer ${Math.round(position.x * 100)}%, ${Math.round(position.y * 100)}%`
                  : "Move pointer over canvas"}
              </span>
            </>
          )}
        </PointerTracker>
        <RemoteCursors cursors={cursors} currentUserId={userId} />
      </div>
      <div className="canvas-footer">
        <span>Tip: Select the eraser to remove strokes</span>
        <span>{WIDTH} × {HEIGHT} canvas</span>
      </div>
    </div>
  );
}
