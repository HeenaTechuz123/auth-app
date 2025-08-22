// src/components/navbar/Navbar.js
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.scss";
import { AuthContext } from "../../context/AuthContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(null);

  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const toggleSubmenu = (menu) => {
    setSubmenuOpen(submenuOpen === menu ? null : menu);
  };

  const handleSubmenuClick = (menu, event) => {
    // Prevent any default behavior and event bubbling
    event.preventDefault();
    event.stopPropagation();
    // For mobile, toggle submenu visibility
    toggleSubmenu(menu);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false); // Close mobile menu
    navigate("/"); // redirect to login
  };

  const handleNavClick = () => {
    setIsOpen(false); // Close mobile menu when nav item is clicked
  };

  // Close mobile menu when clicking outside
  const handleMenuOutsideClick = (event) => {
    if (event.target.classList.contains('nav-menu') && event.target.classList.contains('active')) {
      setIsOpen(false);
    }
  };

  // Close menu when clicking on backdrop
  const handleBackdropClick = (event) => {
    // Only close if clicking directly on backdrop, not on menu content
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
        {isOpen && <div className="mobile-backdrop" onClick={handleBackdropClick}></div>}
        
        <ul className={isOpen ? "nav-menu active" : "nav-menu"} onClick={handleMenuOutsideClick}>
          {/* Example Menus */}
           <li className="nav-item">
              <Link to="/" className="nav-link" onClick={handleNavClick}>Home</Link>
           </li>
          <li className="nav-item">
            <button
              className="nav-link dropdown-toggle"
              onClick={(e) => handleSubmenuClick("products", e)}
              type="button"
            >
              Products ▾
            </button>
            <ul className={`submenu ${submenuOpen === "products" ? "show" : ""}`}>
              <li><Link to="/products/a" onClick={handleNavClick}>Product A</Link></li>
              <li><Link to="/products/b" onClick={handleNavClick}>Product B</Link></li>
              <li><Link to="/products/c" onClick={handleNavClick}>Product C</Link></li>
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
            <ul className={`submenu ${submenuOpen === "solutions" ? "show" : ""}`}>
              <li><Link to="/products/a" onClick={handleNavClick}>Solutions A</Link></li>
              <li><Link to="/products/b" onClick={handleNavClick}>Solutions B</Link></li>
              <li><Link to="/products/c" onClick={handleNavClick}>Solutions C</Link></li>
            </ul>
          </li>

          <li className="nav-item">
            <Link to="/businesses" className="nav-link" onClick={handleNavClick}>Businesses</Link>
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
                      Hi, <strong>{user || "Guest"}</strong> ▾
                    </button>
                    <ul className={`submenu ${submenuOpen === "account" ? "show" : ""}`}>
                      <li><Link to="/profile" onClick={handleNavClick}>My Account</Link></li>
                    </ul>
                  </li>   
              <li>
                <button onClick={handleLogout} className="btn-login">Logout</button>
              </li>
            </>
          ) : (
            <li>
              <Link to="/login" className="btn-login" onClick={handleNavClick}>Login</Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
