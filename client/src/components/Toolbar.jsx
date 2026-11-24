const COLORS = ["#3446a8", "#20242d", "#d14b43", "#e39a36", "#258568", "#8656a5"];

export default function Toolbar({
  tool, setTool, color, setColor, brushSize, setBrushSize, onClear,
  onToggleFullscreen, isFullscreen
}) {
  return (
    <section className="toolbar" aria-label="Drawing tools">
      <div className="tool-group">
        <span className="toolbar-label">Tools</span>
        <button className={`tool-button ${tool === "pen" ? "active" : ""}`} onClick={() => setTool("pen")} title="Pen" aria-label="Pen">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 20 4.2-1 10.9-10.9a2.1 2.1 0 0 0-3-3L5.2 16 4 20Z"/><path d="m14.8 6.2 3 3"/></svg>
          <span>Pen</span>
        </button>
        <button className={`tool-button ${tool === "eraser" ? "active" : ""}`} onClick={() => setTool("eraser")} title="Eraser" aria-label="Eraser">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 16-3-3a2 2 0 0 1 0-2.8l7.2-7.2a2 2 0 0 1 2.8 0l6 6a2 2 0 0 1 0 2.8L13 20H8l-1-4Z"/><path d="m7 16 6-6"/></svg>
          <span>Eraser</span>
        </button>
      </div>

      <span className="toolbar-divider" />

      <div className="tool-group color-group">
        <span className="toolbar-label">Colour</span>
        <div className="color-swatches">
          {COLORS.map((swatch) => (
            <button
              key={swatch}
              className={`color-swatch ${color === swatch ? "selected" : ""}`}
              style={{ "--swatch": swatch }}
              onClick={() => { setColor(swatch); setTool("pen"); }}
              aria-label={`Select ${swatch} colour`}
              title={swatch}
            />
          ))}
          <label className="custom-color" title="Choose custom colour">
            <input type="color" value={color} onChange={(event) => { setColor(event.target.value); setTool("pen"); }} aria-label="Custom colour" />
            <span>+</span>
          </label>
        </div>
      </div>

      <span className="toolbar-divider" />

      <div className="tool-group size-group">
        <label className="toolbar-label" htmlFor="brush-size">Size <strong>{brushSize}px</strong></label>
        <input id="brush-size" type="range" min="2" max="16" step="1" value={brushSize} onChange={(event) => setBrushSize(Number(event.target.value))} />
      </div>

      <span className="toolbar-spacer" />
      <button
        className="fullscreen-button"
        onClick={onToggleFullscreen}
        title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      >
        {isFullscreen ? (
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3v5H3M16 3v5h5M8 21v-5H3m13 5v-5h5" /></svg>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5" /></svg>
        )}
        <span>{isFullscreen ? "Exit fullscreen" : "Fullscreen"}</span>
      </button>
      <button className="clear-button" onClick={onClear}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6m4 4v6m6-6v6"/></svg>
        Clear board
      </button>
    </section>
  );
}
