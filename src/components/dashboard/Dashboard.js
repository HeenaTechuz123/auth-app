import React from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "User"; // ✅ fetch stored name

  const handleLogout = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("authToken"); // if you plan to use token later
    navigate("/");
  };

  return (
    <div className="dashboard">
      <h1>Welcome, {userName}!</h1>
      <button onClick={handleLogout} className="common-btn">
        Logout
      </button>
    </div>
  );
}
