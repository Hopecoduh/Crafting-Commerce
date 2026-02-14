import { useState } from "react";
import { api, setToken } from "../api";

export default function AuthPage({ onAuthSuccess }) {
  const [mode, setMode] = useState("login"); // login | register
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res =
        mode === "login"
          ? await api.login({ email, password })
          : await api.register({
              email,
              password,
              display_name: displayName,
            });

      setToken(res.token);
      onAuthSuccess();
    } catch (err) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#111",
        color: "white",
      }}
    >
      <div
        style={{
          width: 360,
          padding: 30,
          borderRadius: 12,
          background: "#1c1c1c",
          boxShadow: "0 0 40px rgba(0,0,0,0.6)",
        }}
      >
        <h2 style={{ marginBottom: 20, textAlign: "center" }}>
          Crafting-Commerce
        </h2>

        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          <button
            onClick={() => setMode("login")}
            style={{
              flex: 1,
              background: mode === "login" ? "#333" : "#222",
              color: "white",
              border: "1px solid #444",
              padding: 8,
              cursor: "pointer",
            }}
          >
            Login
          </button>
          <button
            onClick={() => setMode("register")}
            style={{
              flex: 1,
              background: mode === "register" ? "#333" : "#222",
              color: "white",
              border: "1px solid #444",
              padding: 8,
              cursor: "pointer",
            }}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />

          {mode === "register" && (
            <input
              placeholder="Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              style={inputStyle}
            />
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: "#2d6cdf",
              border: "none",
              padding: 10,
              color: "white",
              cursor: "pointer",
            }}
          >
            {loading
              ? "Please wait..."
              : mode === "login"
                ? "Login"
                : "Create Account"}
          </button>

          {error && (
            <div style={{ color: "crimson", fontSize: 14 }}>{error}</div>
          )}
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: 8,
  background: "#222",
  border: "1px solid #444",
  color: "white",
};
