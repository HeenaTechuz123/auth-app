// src/components/myaccount/MyAccount.js
import React, { useState, useEffect,useContext } from "react";
import "./MyAccount.scss";
import { AuthContext } from "../../context/AuthContext";

export default function MyAccount() {
  // ✅ Use useContext to access the AuthContext
  const { user, refreshUser } = useContext(AuthContext); // ✅ Now this works

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    profile_pic: null,
    cover_photo: null,
    profile_pic_preview: null,
    cover_photo_preview: null,
  });

  const [isDirty, setIsDirty] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const userId = localStorage.getItem("userId"); // read once

  const [passwordErrors, setPasswordErrors] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // ✅ Load user info from users table
  useEffect(() => {
    const userId = localStorage.getItem("userId"); // saved at login
    // console.log("🔍 MyAccount: userId from localStorage:", userId);
    
    
    if (userId) {
      // console.log("🚀 MyAccount: Fetching user data from API...");
      fetch(`http://localhost:5001/api/users/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          // console.log("📦 MyAccount: API response:", data);
          if (data.error) {
            console.error("❌ MyAccount: API error:", data.error);
          } else {
            // console.log("📸 Image data from API:", { profile_pic: data.profile_pic, cover_photo: data.cover_photo });
            setFormData((prev) => ({
              ...prev,
              firstName: data.fullName ? data.fullName.split(' ')[0] : '', // Extract first name from fullName
              lastName: data.lastName || '',
              email: data.email,
              phone: data.phone || '',
              profile_pic: data.profile_pic,
              cover_photo: data.cover_photo,
            }));
          }
        })
        .catch((err) => console.error("❌ Error fetching user:", err));
    } else {
      console.log("⚠️ MyAccount: No userId found in localStorage");
    }
  }, []);

  // Password validation function
  const validatePassword = (password) => {
    const errors = [];
    
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    
    if (!/\d/.test(password)) {
      errors.push("Password must contain at least one number");
    }
    
    if (!/[@$!%*?&#+\-_=<>{}[\]|~`^().,;:'"\/\\]/.test(password)) {
      errors.push("Password must contain at least one special character");
    }
    
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsDirty(true);
    
    // Real-time password validation - only when actively changing password
    if (name === "newPassword") {
      const errors = value ? validatePassword(value) : [];
      setPasswordErrors(prev => ({ 
        ...prev, 
        newPassword: errors.length > 0 ? errors[0] : "",
        // Clear old password error when starting to type new password
        oldPassword: ""
      }));
    }
    
    if (name === "confirmPassword") {
      const newPassword = formData.newPassword;
      const confirmPassword = value;
      const matches = confirmPassword === newPassword;
      setPasswordErrors(prev => ({ 
        ...prev, 
        confirmPassword: confirmPassword && !matches ? "Passwords do not match" : "" 
      }));
    }

    // Also validate confirm password when new password changes
    if (name === "newPassword" && formData.confirmPassword) {
      const matches = formData.confirmPassword === value;
      setPasswordErrors(prev => ({ 
        ...prev, 
        confirmPassword: formData.confirmPassword && !matches ? "Passwords do not match" : "" 
      }));
    }

    // Clear password errors when typing in old password field (not validation trigger)
    if (name === "oldPassword") {
      setPasswordErrors(prev => ({ 
        ...prev, 
        oldPassword: "" 
      }));
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  console.log("🔍 Submit attempt with data:", {
    newPassword: !!formData.newPassword,
    confirmPassword: !!formData.confirmPassword, 
    oldPassword: !!formData.oldPassword,
    firstName: formData.firstName,
    email: formData.email
  });

  // Clear previous errors
  setPasswordErrors({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Validate passwords ONLY if user is trying to change password (has new password)
  if (formData.newPassword || formData.confirmPassword) {
    let hasErrors = false;

    // Check if old password is provided when changing password
    if ((formData.newPassword || formData.confirmPassword) && !formData.oldPassword) {
      setPasswordErrors(prev => ({ 
        ...prev, 
        oldPassword: "Old password is required when changing password" 
      }));
      hasErrors = true;
    }

    // Validate new password strength
    if (formData.newPassword) {
      const newPasswordErrors = validatePassword(formData.newPassword);
      if (newPasswordErrors.length > 0) {
        setPasswordErrors(prev => ({ 
          ...prev, 
          newPassword: newPasswordErrors[0] 
        }));
        hasErrors = true;
      }
    }

    // Check password match
    if (formData.newPassword !== formData.confirmPassword) {
      setPasswordErrors(prev => ({ 
        ...prev, 
        confirmPassword: "Passwords do not match" 
      }));
      hasErrors = true;
    }

    // Check if new password is different from old password
    if (formData.oldPassword && formData.newPassword && formData.oldPassword === formData.newPassword) {
      setPasswordErrors(prev => ({ 
        ...prev, 
        newPassword: "New password must be different from old password" 
      }));
      hasErrors = true;
    }

    if (hasErrors) {
      alert("❌ Please fix the password validation errors before submitting");
      return;
    }
  }

  try {
    const formDataToSend = new FormData();
    formDataToSend.append("firstName", formData.firstName);
    formDataToSend.append("lastName", formData.lastName);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("phone", formData.phone);

     // ✅ Add logged-in userId here
   if (userId) {
    formDataToSend.append("userId", userId);
  }

    
    // Only send password if there's a new password
    if (formData.newPassword) {
      formDataToSend.append("password", formData.newPassword);
      formDataToSend.append("oldPassword", formData.oldPassword);
    }

    // ✅ add files if selected (only if they are File objects, not strings)
    if (formData.profile_pic && formData.profile_pic instanceof File) {
      formDataToSend.append("profile_pic", formData.profile_pic);
    }
    if (formData.cover_photo && formData.cover_photo instanceof File) {
      formDataToSend.append("cover_photo", formData.cover_photo);
    }

    const res = await fetch("http://localhost:5001/api/profiles", {
      method: "POST",
      body: formDataToSend, // ✅ no headers (browser sets correct multipart boundary)
    });

    const data = await res.json();
    if (res.ok) {
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);  

         // 🚀 The key step: call the refreshUser function from the context.
        // This will update the shared user state.
        refreshUser();

         setIsDirty(false);

      // Reset form but keep profile info and uploaded images
      setFormData(prev => ({
        ...prev,
        lastName: prev.lastName, // Keep the entered lastName
        phone: prev.phone, // Keep the entered phone
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
        // Clear only the preview images and file objects, update with saved filenames
        profile_pic_preview: null,
        cover_photo_preview: null,
        profile_pic: data.profile_pic || (prev.profile_pic instanceof File ? null : prev.profile_pic),
        cover_photo: data.cover_photo || (prev.cover_photo instanceof File ? null : prev.cover_photo)
      }));

      // Clear password errors on successful submission
      setPasswordErrors({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Also refresh from server to ensure we have the latest data
      setTimeout(() => {
        const userId = localStorage.getItem("userId");
        if (userId) {
          fetch(`http://localhost:5001/api/users/${userId}`)
            .then((res) => res.json())
            .then((userData) => {
              // console.log("🔄 Refreshed user data:", userData);
              if (!userData.error) {
                setFormData(prev => ({
                  ...prev,
                  profile_pic: userData.profile_pic || prev.profile_pic,
                  cover_photo: userData.cover_photo || prev.cover_photo,
                }));
              }
            })
            .catch((err) => console.error("❌ Error refreshing user data:", err));
        }
      }, 1000); // Small delay to ensure database is updated
    } else {
      // Handle specific old password error
      if (data.error === "Old password is incorrect") {
        setPasswordErrors(prev => ({ 
          ...prev, 
          oldPassword: "Old password is incorrect" 
        }));
      }
      // alert("❌ Error: " + data.error);
    }
  } catch (err) {
    // console.error("❌ Network error:", err);
  }
};


  return (
    <div className="profile-page">
      {showSuccessPopup && (
        <div className="success-popup">
          <div className="popup-content">
            <div className="success-icon">✓</div>
            <h3>Profile Saved Successfully!</h3>
            <p>Your changes have been saved.</p>
          </div>
        </div>
      )}
      <div className="container">
        <div className="profile-pic">
          {/* Cover Image */}
         <div className="cover-photo">
          <img
            src={
              formData.cover_photo_preview
                ? formData.cover_photo_preview
                : (formData.cover_photo && typeof formData.cover_photo === 'string' && formData.cover_photo !== 'null')
                ? `http://localhost:5001/uploads/${formData.cover_photo}`
                : "http://localhost:5001/uploads/default-cover.svg"
            }
            alt="Cover"
            onError={(e) => {
              console.log("Cover image failed to load:", e.target.src);
              e.target.src = "http://localhost:5001/uploads/default-cover.svg";
            }}
          />
          
          <div className="edit-icon" onClick={() => document.getElementById('cover-photo-input').click()}>
            <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
            </svg>
          </div>

          <input
            id="cover-photo-input"
            type="file"
            name="cover_photo"
            accept="image/*"
            style={{display: 'none'}}
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setFormData((prev) => ({
                  ...prev,
                  cover_photo: file, // Store the File object for upload
                  cover_photo_preview: URL.createObjectURL(file), // preview
                }));
              }
            }}
          />
        </div>

          {/* Profile Image */}
          <div className="profile-section">
            <img
              src={
                formData.profile_pic_preview
                  ? formData.profile_pic_preview
                  : (formData.profile_pic && typeof formData.profile_pic === 'string' && formData.profile_pic !== 'null')
                  ? `http://localhost:5001/uploads/${formData.profile_pic}`
                  : "http://localhost:5001/uploads/default-profile.svg"
              }
              alt="Profile"
              className="profile-img"
              onError={(e) => {
                console.log("Profile image failed to load:", e.target.src);
                e.target.src = "http://localhost:5001/uploads/default-profile.svg";
              }}
            />
            
            <div className="profile-edit-icon" onClick={() => document.getElementById('profile-pic-input').click()}>
              <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
              </svg>
            </div>

            <input
              id="profile-pic-input"
              type="file"
              name="profile_pic"
              accept="image/*"
              style={{display: 'none'}}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setFormData((prev) => ({
                    ...prev,
                    profile_pic: file, // Store the File object for upload
                    profile_pic_preview: URL.createObjectURL(file), // preview
                  }));
                }
              }}
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
                className={passwordErrors.oldPassword ? "error" : ""}
                placeholder="Required only when changing password"
                autoComplete="new-password"
              />
              {passwordErrors.oldPassword && (
                <span className="error-message">{passwordErrors.oldPassword}</span>
              )}
            </div>

            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className={passwordErrors.newPassword ? "error" : ""}
                placeholder="Leave empty to keep current password"
              />
              {passwordErrors.newPassword && (
                <span className="error-message">{passwordErrors.newPassword}</span>
              )}
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={passwordErrors.confirmPassword ? "error" : ""}
                placeholder="Confirm new password"
              />
              {passwordErrors.confirmPassword && (
                <span className="error-message">{passwordErrors.confirmPassword}</span>
              )}
            </div>
          </div>

          <button className="common-btn" disabled={!isDirty}>Submit</button>
        </form>
      </div>
    </div>
  );
}
