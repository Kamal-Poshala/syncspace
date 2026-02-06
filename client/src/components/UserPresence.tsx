interface User {
  userId: string;
  username: string;
}

interface UserPresenceProps {
  users: User[];
}

function UserPresence({ users }: UserPresenceProps) {
  return (
    <section className="users">
      <h3>Active Users</h3>

      {users.length === 0 ? (
        <p style={{ color: "#6b7280" }}>No users connected</p>
      ) : (
        <ul>
          {users.map((u) => (
            <li key={u.userId}>{u.username}</li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default UserPresence;
