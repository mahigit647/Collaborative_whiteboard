import ConnectionStatus from "./ConnectionStatus.jsx";
import UserAvatars from "./UserAvatars.jsx";

export default function Header({ users, userId }) {
  return (
    <header className="app-header">
      <div className="brand">
        <div className="brand-mark" aria-hidden="true">W</div>
        <div>
          <div className="brand-name">Workspace</div>
          <div className="brand-subtitle">Collaborative whiteboard</div>
        </div>
      </div>

      <div className="header-right">
        <ConnectionStatus />
        <span className="header-divider" />
        <UserAvatars users={users} currentUserId={userId} />
      </div>
    </header>
  );
}
