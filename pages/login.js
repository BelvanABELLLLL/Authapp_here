import React, { useState } from "react";
import { useRouter } from "next/router";
import { signIn, getSession } from "next-auth/react";
import Link from "next/link";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.ok) {
      await new Promise((r) => setTimeout(r, 500));
      const session = await getSession();

      const userRole = session?.user?.role;

      if (userRole === "admin") {
        router.push("/dashboard/admin");
      } else if (userRole === "user") {
        router.push("/dashboard/user");
      } else {
        setError("Invalid role");
      }
    } else {
      setError("Login failed. Please check your credentials.");
    }

    setIsLoading(false);
  }

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2 style={styles.title}>Login</h2>

        <div style={styles.inputContainer}>
          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div style={styles.inputContainer}>
          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.buttonContainer}>
          <button type="submit" disabled={isLoading} style={styles.button}>
            {isLoading ? "Loading..." : "Sign In"}
          </button>
        </div>

        <p style={styles.linkText}>
          Belum punya akun?{" "}
          <Link href="/register" style={styles.link}>
            Daftar di sini
          </Link>
        </p>
      </form>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#ffe4ec",
  },
  card: {
    background: "#fff",
    padding: "32px 24px",
    borderRadius: 12,
    width: 400,
    boxShadow: "0 10px 25px rgba(233,30,99,0.2)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    color: "#e91e63",
    marginBottom: 24,
    width: "100%",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 16,
    display: "flex",
    justifyContent: "center",
  },
  input: {
    width: "90%",
    padding: "12px 16px",
    borderRadius: 6,
    border: "1px solid #f8bbd0",
    fontSize: 14,
  },
  buttonContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    marginBottom: 16,
  },
  button: {
    width: "90%",
    padding: 12,
    background: "#e91e63",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 14,
    fontWeight: "bold",
  },
  error: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
    textAlign: "center",
    width: "90%",
    backgroundColor: "#ffe6e6",
    padding: "8px 12px",
    borderRadius: "4px",
    border: "1px solid #ffcccc",
  },
  linkText: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 14,
    width: "100%",
  },
  link: {
    color: "#e91e63",
    fontWeight: "bold",
    textDecoration: "none",
  },
};

export default LoginPage;