import { withConnectionStatus } from "../patterns/withConnectionStatus.jsx";

function ConnectionStatusView({ connected }) {
  return (
    <span className={`connection-status ${connected ? "is-connected" : "is-disconnected"}`}>
      <span className="status-dot" />
      {connected ? "Connected" : "Disconnected"}
    </span>
  );
}

const ConnectionStatus = withConnectionStatus(ConnectionStatusView);
export default ConnectionStatus;
