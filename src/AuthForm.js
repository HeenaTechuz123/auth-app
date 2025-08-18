import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthForm() {
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: ""
  });
  const [passwordError, setPasswordError] = useState("");
  const [formMessage, setFormMessage] = useState({ type: "", text: "" });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "password" && activeTab === "signup") {
      validatePassword(value);
    }
  };

  const validatePassword = (password) => {
    const strongRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!strongRegex.test(password)) {
      setPasswordError(
        "Password must be at least 8 characters, include uppercase, lowercase, number & special character."
      );
    } else {
      setPasswordError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormMessage({ type: "", text: "" });

    if (activeTab === "signup" && passwordError) {
      setFormMessage({ type: "error", text: "Fix password errors before submitting." });
      return;
    }

    const endpoint =
      activeTab === "signup"
        ? "http://localhost:5001/signup"
        : "http://localhost:5001/login";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        setFormMessage({ type: "error", text: data.error || "Something went wrong." });
        return;
      }

      setFormMessage({ type: "success", text: data.message });

      if (activeTab === "login") {
        setTimeout(() => navigate("/dashboard"), 1500); // wait so user can read message
      }

      setFormData({ fullName: "", email: "", password: "" });
    } catch (err) {
      console.error("Network error:", err);
      setFormMessage({ type: "error", text: "A network error occurred. Try again." });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Tabs */}
        <div className="tabs">
          <button
            className={activeTab === "login" ? "active" : ""}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
          <button
            className={activeTab === "signup" ? "active" : ""}
            onClick={() => setActiveTab("signup")}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {activeTab === "signup" && (
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                placeholder="Enter your name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group password-group">
            <label>Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          {/* Password error */}
          {activeTab === "signup" && passwordError && (
            <p className="error-text">{passwordError}</p>
          )}

          {/* Form-wide messages */}
          {formMessage.text && (
            <p className={formMessage.type === "error" ? "error-text" : "success-text"}>
              {formMessage.text}
            </p>
          )}

          <button type="submit" className="submit-btn">
            {activeTab === "login" ? "Login" : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}
