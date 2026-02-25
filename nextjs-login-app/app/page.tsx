"use client";

import { useState, FormEvent } from "react";
import "./globals.css";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"error" | "success" | "">("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");

    if (!username.trim()) {
      setMessage("Username is required");
      setMessageType("error");
      return;
    }

    if (!password.trim()) {
      setMessage("Password is required");
      setMessageType("error");
      return;
    }

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setMessageType("success");
        setLoggedInUser(username);
        setIsLoggedIn(true);
      } else {
        setMessage(data.message);
        setMessageType("error");
      }
    } catch {
      setMessage("An error occurred. Please try again.");
      setMessageType("error");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoggedInUser("");
    setUsername("");
    setPassword("");
    setMessage("");
    setMessageType("");
  };

  if (isLoggedIn) {
    return (
      <div className="welcome-container">
        <h1 id="welcome-title">Welcome!</h1>
        <p id="welcome-message">You are logged in as <strong>{loggedInUser}</strong></p>
        <button id="logout-button" className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="login-container">
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit} id="login-form">
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>
        <button type="submit" id="signin-button" className="signin-button">
          Sign In
        </button>
      </form>
      {message && (
        <p
          id="message"
          className={messageType === "error" ? "error-message" : "success-message"}
        >
          {message}
        </p>
      )}
    </div>
  );
}
