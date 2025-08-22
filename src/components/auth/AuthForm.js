// src/components/auth/AuthForm.js
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthForm.scss";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { AuthContext } from "../../context/AuthContext";

export default function AuthForm() {
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });
  const [passwordError, setPasswordError] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [formMessage, setFormMessage] = useState({ type: "", text: "" });

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // ✅ Name validation
  const validateName = (name) => {
    const nameRegex = /^[A-Za-z]+([ '-][A-Za-z]+)*$/;
    if (!name) return "Name is required";
    if (name.length < 2) return "Name must be at least 2 characters";
    if (name.length > 50) return "Name must not exceed 50 characters";
    if (!nameRegex.test(name)) return "Invalid name format";
    const words = name.split(" ");
    for (let word of words) {
      if (!(word === word.toUpperCase() || word === word.toLowerCase())) {
        return "Each word must be all uppercase or all lowercase";
      }
    }
    return "";
  };

  // ✅ Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Invalid email format";
    if (email.length > 254) return "Email must not exceed 254 characters";
    return "";
  };

  // ✅ Password validation
  const validatePassword = (password) => {
    const strongRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongRegex.test(password)) {
      setPasswordError(
        "Password must be at least 8 chars, include uppercase, lowercase, number & special char."
      );
    } else {
      setPasswordError("");
    }
  };

  // ✅ Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "fullName") {
      const cleanValue = value.replace(/\s{2,}/g, " ");
      setFormData({ ...formData, [name]: cleanValue });
      setNameError(validateName(cleanValue));
    } else if (name === "email") {
      setFormData({ ...formData, [name]: value.trim() });
      setEmailError(validateEmail(value.trim()));
    } else if (name === "password" && activeTab === "signup") {
      setFormData({ ...formData, [name]: value });
      validatePassword(value);
    } else {
      setFormData({ ...formData, [name]: value.trim() });
    }
  };

  // ✅ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormMessage({ type: "", text: "" });

    if (activeTab === "signup") {
      const nameValidationError = validateName(formData.fullName);
      if (nameValidationError) {
        setNameError(nameValidationError);
        return;
      }
      const emailValidationError = validateEmail(formData.email);
      if (emailValidationError) {
        setEmailError(emailValidationError);
        return;
      }
      if (passwordError) {
        setFormMessage({ type: "error", text: "Fix password errors before submitting." });
        return;
      }
    }

    if (activeTab === "login") {
      const emailValidationError = validateEmail(formData.email);
      if (emailValidationError) {
        setEmailError(emailValidationError);
        return;
      }
    }

    const normalizedFormData = {
      ...formData,
      fullName: formData.fullName.toUpperCase(),
    };

    const endpoint =
      activeTab === "signup"
        ? "http://localhost:5001/signup"
        : "http://localhost:5001/login";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(normalizedFormData),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormMessage({ type: "error", text: data.error || "Something went wrong." });
        return;
      }

      if (activeTab === "signup") {
        setFormMessage({ type: "success", text: data.message + " Redirecting to login..." });
        setTimeout(() => switchTab("login"), 1000);
      } else if (activeTab === "login") {
          login(data.user?.fullName || formData.fullName || formData.email.split("@")[0]);
          setFormMessage({ type: "success", text: data.message });
          setTimeout(() => navigate("/"), 500);
      }

      setFormData({ fullName: "", email: "", password: "" });
    } catch (err) {
      console.error("Network error:", err);
      setFormMessage({ type: "error", text: "A network error occurred. Try again." });
    }
  };

  // ✅ Switch tab
  const switchTab = (tab) => {
    setActiveTab(tab);
    setPasswordError("");
    setNameError("");
    setEmailError("");
    setFormMessage({ type: "", text: "" });
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="tabs">
          <button
            className={activeTab === "login" ? "active" : ""}
            onClick={() => switchTab("login")}
          >
            Login
          </button>
          <button
            className={activeTab === "signup" ? "active" : ""}
            onClick={() => switchTab("signup")}
          >
            Sign Up
          </button>
        </div>

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
              {nameError && <p className="error-text">{nameError}</p>}
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
            {emailError && <p className="error-text">{emailError}</p>}
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
              {showPassword ? <FiEye /> : <FiEyeOff />}
            </span>
          </div>

          {activeTab === "signup" && passwordError && (
            <p className="error-text">{passwordError}</p>
          )}
          {formMessage.text && (
            <p className={formMessage.type === "error" ? "error-text" : "success-text"}>
              {formMessage.text}
            </p>
          )}

          <button type="submit" className="common-btn">
            {activeTab === "login" ? "Login" : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}
