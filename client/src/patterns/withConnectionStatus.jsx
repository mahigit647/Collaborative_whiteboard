import { useBoard } from "../context/BoardContext.jsx";

// Higher-order component: adds connection information to a wrapped component.
export function withConnectionStatus(Component) {
  return function ConnectionAwareComponent(props) {
    const { connected } = useBoard();
    return <Component {...props} connected={connected} />;
  };
}
