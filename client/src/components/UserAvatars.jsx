export default function UserAvatars({ users, currentUserId }) {
  const visibleUsers = users.slice(0, 4);

  return (
    <div className="user-presence" aria-label={`${users.length} connected users`}>
      <div className="avatar-stack">
        {visibleUsers.map((user, index) => (
          <span
            className={`user-avatar avatar-${index % 4}`}
            key={user.id}
            title={user.id === currentUserId ? "You" : `User ${user.id}`}
          >
            {user.id === currentUserId ? "Y" : String(user.id).slice(-2)}
          </span>
        ))}
        {users.length > 4 && <span className="avatar-extra">+{users.length - 4}</span>}
      </div>
      <span className="user-count">{users.length} online</span>
    </div>
  );
}
