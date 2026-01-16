import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Link from "next/link";

function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passError, setPassError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setPassError(password !== confirmPassword);
  }, [password, confirmPassword]);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage("");

    if (password !== confirmPassword) {
      setPassError(true);
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/user/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert("Registration successful!");
      router.push("/login");
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2 style={styles.title}>Register</h2>

        <div style={styles.inputContainer}>
          <input
            style={styles.input}
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

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

        <div style={styles.inputContainer}>
          <input
            style={styles.input}
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {passError && <p style={styles.error}>Passwords do not match</p>}
        {errorMessage && <p style={styles.error}>{errorMessage}</p>}

        <div style={styles.buttonContainer}>
          <button type="submit" disabled={isLoading} style={styles.button}>
            {isLoading ? "Signing Up..." : "Sign Up"}
          </button>
        </div>

        <p style={styles.linkText}>
          Sudah punya akun?{" "}
          <Link href="/login" style={styles.link}>
            Login
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
    marginBottom: 8,
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
  linkText: {
    marginTop: 12,
    textAlign: "center",
    fontSize: 14,
    width: "100%",
  },
  link: {
    color: "#e91e63",
    fontWeight: "bold",
    textDecoration: "none",
  },
  error: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
    textAlign: "center",
    width: "90%",
  },
};

export default RegisterPage;