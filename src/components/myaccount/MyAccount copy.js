// src/components/navbar/Navbar.js
import React, { useState, useContext } from "react";
import "./MyAccount.scss";

export default function MyAccount() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    personalPhone: "",
    workPhone: "",
    countryCity: "",
    organization: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();    
    try{
      const res = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

       if (res.ok) {
        const data = await res.json();
        alert("✅ Data saved successfully!");
        console.log("Form Submitted", formData);
        console.log(data);
      } else {
        alert("❌ Failed to save data");
      }

    } catch (err) {
      console.error("Error:", err);
    }
  };
  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-pic">
          {/* Cover Image */}
          <div className="cover-photo">
            <img
              src="https://placehold.co/1440x300" // replace with your cover image path
              alt="Cover"
            />
          </div>

          {/* Profile Image */}
          <div className="profile-section">
            <img
              src="https://placehold.co/100x100" // replace with your profile image path
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
              <label>First name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Name"
              />
            </div>
            <div className="form-group">
              <label>Last name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Surname"
              />
            </div>
            <div className="form-group">
              <label>Username (not your e-mail)</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
              />
            </div>
            <div className="form-group">
              <label>Your e-mail</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="mail@example.com"
              />
            </div>
            <div className="form-group">
              <label>Personal phone number</label>
              <input
                type="text"
                name="personalPhone"
                value={formData.personalPhone}
                onChange={handleChange}
                placeholder="+380 44 123 45 67"
              />
            </div>
            <div className="form-group">
              <label>Work phone number</label>
              <input
                type="text"
                name="workPhone"
                value={formData.workPhone}
                onChange={handleChange}
                placeholder="+380 44 123 45 67"
              />
            </div>
            <div className="form-group">
              <label>Country, City</label>
              <input
                type="text"
                name="countryCity"
                value={formData.countryCity}
                onChange={handleChange}
                placeholder="Ukraine, Kiev"
              />
            </div>
            <div className="form-group">
              <label>Organization</label>
              <input
                type="text"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                placeholder="Organization name"
              />
            </div>
          </div>

          {/* Password Section */}
          <div className="form-section">
            <h3>② Password</h3>
            <div className="form-group">
              <label>Old password *</label>
              <input
                type="password"
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
                placeholder="********"
              />
            </div>
            <div className="form-group">
              <label>New password *</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="********"
              />
            </div>
            <div className="form-group">
              <label>Confirm new password *</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="********"
              />
            </div>

            <button type="submit" className="common-btn">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
