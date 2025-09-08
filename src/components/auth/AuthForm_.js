// src/components/auth/AuthForm.js
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthForm.scss";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { AuthContext } from "../../context/AuthContext";

export default function AuthForm() {
   const [activeTab, setActiveTab] = useState("login");
 // ✅ Switch tab
  const switchTab = (tab) => {
    setActiveTab(tab);
  };

  const [formData, setFromData] = useState({
      fullName: "",
      email:"",
      password: ""
  })
  const [message, setMessage] = useState("");

  const handleChange = (e) =>{    
    setFromData({
       ...formData, 
      [e.target.name] : e.target.value
    })
  }

  const handleSubmit = async (e) =>{
    e.preventDefault();
    

    const res = await fetch("http://localhost:5001/signup", {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    })

    const data = await res.json();
    try{
      if(res.data){
        setMessage("send");
      }else{
        setMessage("error");
      }
    }catch{

    }
  }
 

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className={`tabs ${activeTab === "signup" ? "signup-active" : ""}`}>
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

        <form className="profile-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"  
          value={formData.fullName}  
          onChange={handleChange}      
        />
          <br></br>
        <input
          type="email"
          name="email"
          placeholder="Email"   
          value={formData.email}  
          onChange={handleChange}               
        />
          <br></br>
        <input
          type="password"
          name="password"
          placeholder="Password" 
          value={formData.password} 
          onChange={handleChange}                       
        />
        <br></br>

        <button type="submit">Sign Up</button>
      </form>
      </div>
    </div>
  );
}
