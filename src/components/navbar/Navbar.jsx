// src/components/navbar/Navbar.js
import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.scss";
import { AuthContext } from "../../context/AuthContext";

export default function Navbar() {
   const [isOpen, setIsOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(null);

  const { user, login, logout } = useContext(AuthContext);
  const navigate = useNavigate();


  // ✅ Fetch profile only once when user logs in
  useEffect(() => {
    if (!user?.id) return;

    console.log("🔍 Fetching profile for userId:", user.id);

    fetch(`http://localhost:5001/api/users/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("📦 Profile API response:", data);

        // ✅ Only update if profile_pic or other fields changed
        if (data && data.id) {
          login({
            ...user, // keep existing fields
            ...data, // overwrite with fresh data
          });
        }
      })
      .catch((err) => console.error("❌ Failed to load profile:", err));
  }, [user?.id]); // only runs when _id changes (login/logout)

  const toggleSubmenu = (menu) => {
    setSubmenuOpen(submenuOpen === menu ? null : menu);
  };

  const handleSubmenuClick = (menu, event) => {
    event.preventDefault();
    event.stopPropagation();
    toggleSubmenu(menu);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/"); // redirect to home or login
  };

  const handleNavClick = () => {
    setIsOpen(false);
  };

  const handleMenuOutsideClick = (event) => {
    if (
      event.target.classList.contains("nav-menu") &&
      event.target.classList.contains("active")
    ) {
      setIsOpen(false);
    }
  };

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      setIsOpen(false);
    }
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="nav-logo">
          <span>whitepace</span>
        </Link>

        <div className="menu-icon" onClick={() => setIsOpen(!isOpen)}>
          <span className={isOpen ? "close" : "hamburger"}>
            {isOpen ? "✕" : "☰"}
          </span>
        </div>

        {/* Mobile backdrop */}
        {isOpen && (
          <div className="mobile-backdrop" onClick={handleBackdropClick}></div>
        )}

        <ul
          className={isOpen ? "nav-menu active" : "nav-menu"}
          onClick={handleMenuOutsideClick}
        >
          {/* Example Menus */}
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={handleNavClick}>
              Home
            </Link>
          </li>

          <li className="nav-item">
            <button
              className="nav-link dropdown-toggle"
              onClick={(e) => handleSubmenuClick("products", e)}
              type="button"
            >
              Products ▾
            </button>
            <ul
              className={`submenu ${
                submenuOpen === "products" ? "show" : ""
              }`}
            >
              <li>
                <Link to="/products/a" onClick={handleNavClick}>
                  Product A
                </Link>
              </li>
              <li>
                <Link to="/products/b" onClick={handleNavClick}>
                  Product B
                </Link>
              </li>
              <li>
                <Link to="/products/c" onClick={handleNavClick}>
                  Product C
                </Link>
              </li>
            </ul>
          </li>

          <li className="nav-item">
            <button
              className="nav-link dropdown-toggle"
              onClick={(e) => handleSubmenuClick("solutions", e)}
              type="button"
            >
              Solutions ▾
            </button>
            <ul
              className={`submenu ${
                submenuOpen === "solutions" ? "show" : ""
              }`}
            >
              <li>
                <Link to="/products/a" onClick={handleNavClick}>
                  Solutions A
                </Link>
              </li>
              <li>
                <Link to="/products/b" onClick={handleNavClick}>
                  Solutions B
                </Link>
              </li>
              <li>
                <Link to="/products/c" onClick={handleNavClick}>
                  Solutions C
                </Link>
              </li>
            </ul>
          </li>

          <li className="nav-item">
            <Link to="/businesses" className="nav-link" onClick={handleNavClick}>
              Businesses
            </Link>
          </li>

          {/* User Section */}
          {user ? (
            <>
              <li className="nav-item username">
                <button
                  className="nav-link dropdown-toggle"
                  onClick={(e) => handleSubmenuClick("account", e)}
                  type="button"
                >
                  {/* Profile Picture */}
                {user?.profile_pic ? (
                  <img
                    src={`http://localhost:5001/uploads/${user.profile_pic}`}
                    alt="Profile"
                    className="profile-pic"
                  />
                ) : (
                  <div className="profile-placeholder">
                    {user?.fullName?.charAt(0).toUpperCase() || "G"}
                  </div>
                )}
                  <span>
                    <strong>{user.fullName || "Guest"}</strong>&nbsp;▾
                  </span>
                </button>
                <ul
                  className={`submenu ${
                    submenuOpen === "account" ? "show" : ""
                  }`}
                >
                  <li>
                    <Link to="/profile" onClick={handleNavClick}>
                      My Account
                    </Link>
                  </li>
                  <li>
                    <Link to="/" onClick={handleLogout}>
                      Logout
                    </Link>
                  </li>
                </ul>
              </li>
            </>
          ) : (
            <li>
              <Link to="/login" className="btn-login" onClick={handleNavClick}>
                Login
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
