// src/components/myaccount/MyAccount.js
import React, { useState, useEffect } from "react";
import "./MyAccount.scss";

export default function MyAccount() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // ✅ Load user info from users table
  useEffect(() => {
    const userId = localStorage.getItem("userId"); // saved at login
    if (userId) {
      fetch(`http://localhost:5001/api/users/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          setFormData((prev) => ({
            ...prev,
            firstName: data.fullName || data.firstname, // depends on your users table
            email: data.email,
          }));
        })
        .catch((err) => console.error("❌ Error fetching user:", err));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ check password match
    if (formData.newPassword !== formData.confirmPassword) {
      alert("❌ New password and confirm password do not match!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5001/api/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.newPassword || formData.oldPassword,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Profile saved successfully!");
        console.log("Saved:", data);

        // Reset fields (but keep autofilled name/email)
        setFormData({
          firstName: formData.firstName,
          lastName: "",
          email: formData.email,
          phone: "",
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        alert("❌ Error: " + data.error);
      }
    } catch (err) {
      console.error("❌ Network error:", err);
    }
  };

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-pic">
          {/* Cover Image */}
          <div className="cover-photo">
            <img src="https://placehold.co/1440x300" alt="Cover" />
          </div>

          {/* Profile Image */}
          <div className="profile-section">
            <img
              src="https://placehold.co/100x100"
              alt="Profile"
              className="profile-img"
            />
          </div>
        </div>

        <form className="profile-form" onSubmit={handleSubmit}>
          {/* Profile Section */}
          <div className="form-section">
            <h3>① Profile</h3>

            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                readOnly
              />
            </div>

            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                readOnly
              />
            </div>

            <div className="form-group">
              <label>Phone No</label>
              <input
                type="number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Password Section */}
          <div className="form-section">
            <h3>② Password</h3>

            <div className="form-group">
              <label>Old Password</label>
              <input
                type="password"
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <button className="common-btn">Submit</button>
        </form>
      </div>
    </div>
  );
}
