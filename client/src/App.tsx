import { useEffect, useRef, useState } from "react";
import type { Socket } from "socket.io-client";
import { createSocket } from "./lib/socket";
import Auth from "./components/Auth";
import Layout from "./components/Layout";
import UserPresence from "./components/UserPresence";
import Editor from "./components/Editor";
import { debounce } from "./lib/debounce";

const WORKSPACE_ID = "demo-workspace";

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [users, setUsers] = useState<
    { userId: string; username: string }[]
  >([]);

  const socketRef = useRef<Socket | null>(null);
  const hasJoinedRef = useRef(false);
  const debouncedEmitRef = useRef<(value: string) => void>();

  useEffect(() => {
    if (!token) return;

    const socket = createSocket(token);
    socketRef.current = socket;

    debouncedEmitRef.current = debounce((value: string) => {
      socket.emit("workspace:update", {
        workspaceId: WORKSPACE_ID,
        content: value,
      });
    }, 200);

    socket.connect();

    socket.on("connect", () => {
      if (hasJoinedRef.current) return;
      hasJoinedRef.current = true;

      socket.emit("workspace:join", {
        workspaceId: WORKSPACE_ID,
      });
    });

    socket.on("workspace:state", (data) => {
      setContent(data.content);
      setUsers(data.users);
    });

    socket.on("workspace:update", (data) => {
      setContent(data.content);
    });

    socket.on("user:joined", (user) => {
      setUsers((prev) =>
        prev.find((u) => u.userId === user.userId)
          ? prev
          : [...prev, user]
      );
    });

    socket.on("user:left", ({ userId }) => {
      setUsers((prev) =>
        prev.filter((u) => u.userId !== userId)
      );
    });

    return () => {
      socket.disconnect();
      hasJoinedRef.current = false;
    };
  }, [token]);

  if (!token) {
    return (
      <Layout>
        <Auth onAuthSuccess={setToken} />
      </Layout>
    );
  }

  return (
    <Layout>
      <h1>SyncSpace</h1>
      <p style={{ color: "#555" }}>
        Workspace: <strong>{WORKSPACE_ID}</strong>
      </p>

      <UserPresence users={users} />

      <Editor
        content={content}
        onChange={(value) => {
          setContent(value);
          debouncedEmitRef.current?.(value);
        }}
      />
    </Layout>
  );
}

export default App;
