"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "../../globals.css";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.push("/admin/gallery");
    } else {
      setError("Invalid password");
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#151515",
          border: "1px solid rgba(255,255,255,0.1)",
          padding: "3rem",
          borderRadius: "8px",
          width: "90%",
          maxWidth: "400px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.8rem",
            fontWeight: 400,
            marginBottom: "0.5rem",
          }}
        >
          Admin Login
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginBottom: "2rem" }}>
          Zeno Arete Gallery Management
        </p>
        {error && (
          <p style={{ color: "#e74c3c", fontSize: "0.85rem", marginBottom: "1rem" }}>
            {error}
          </p>
        )}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          style={{
            width: "100%",
            padding: "0.8rem 1rem",
            background: "#0a0a0a",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "var(--text)",
            fontFamily: "var(--font-body)",
            fontSize: "0.95rem",
            borderRadius: "4px",
            marginBottom: "1.5rem",
          }}
          autoFocus
        />
        <button
          type="submit"
          className="btn btn-fill"
          disabled={loading}
          style={{ width: "100%" }}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
