interface User {
  userId: string;
  username: string;
}

interface UserPresenceProps {
  users: User[];
}

function UserPresence({ users }: UserPresenceProps) {
  return (
    <div style={{ marginTop: "1.5rem" }}>
      <h3>Active Users</h3>
      {users.length === 0 ? (
        <p style={{ color: "#777" }}>No users connected</p>
      ) : (
        <ul>
          {users.map((u) => (
            <li key={u.userId}>{u.username}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UserPresence;
