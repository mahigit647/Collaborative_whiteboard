import { useCallback, useState } from "react";

// Render-props component: shares pointer position with whatever UI is passed as children.
export default function PointerTracker({ children }) {
  const [position, setPosition] = useState(null);

  const trackPointer = useCallback((event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    setPosition({
      x: Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width)),
      y: Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height))
    });
  }, []);

  return children({ position, trackPointer });
}
