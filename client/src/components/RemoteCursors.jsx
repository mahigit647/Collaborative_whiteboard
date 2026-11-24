export default function RemoteCursors({ cursors, currentUserId }) {
  return (
    <div className="remote-cursors" aria-hidden="true">
      {Object.entries(cursors)
        .filter(([id]) => String(id) !== String(currentUserId))
        .map(([id, cursor]) => (
          <div
            className="remote-cursor"
            key={id}
            style={{ left: `${cursor.x * 100}%`, top: `${cursor.y * 100}%`, "--cursor-color": cursor.color }}
          >
            <svg viewBox="0 0 20 24"><path d="M2 2v17l5-5 3.5 7 3-1.5-3.5-7H17L2 2Z" /></svg>
            <span>{cursor.name || `User ${id}`}</span>
          </div>
        ))}
    </div>
  );
}
