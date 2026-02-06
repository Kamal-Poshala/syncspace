import { useState } from "react";
import { login, register } from "../lib/api";

interface Props {
  onAuthSuccess: (token: string) => void;
}

function Auth({ onAuthSuccess }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    try {
      if (isLogin) {
        const data = await login(username, password);
        onAuthSuccess(data.token);
      } else {
        await register(username, password);
        const data = await login(username, password);
        onAuthSuccess(data.token);
      }
    } catch (err) {
      setError("Authentication failed");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>{isLogin ? "Login" : "Register"}</h2>

      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button onClick={handleSubmit}>
        {isLogin ? "Login" : "Register"}
      </button>

      <p style={{ marginTop: "1rem" }}>
        {isLogin ? "No account?" : "Have an account?"}{" "}
        <button onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Register" : "Login"}
        </button>
      </p>
    </div>
  );
}

export default Auth;
