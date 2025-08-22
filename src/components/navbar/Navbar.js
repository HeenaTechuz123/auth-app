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

  const handleLogout = () => {
    logout();
    navigate("/"); // redirect to login
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="nav-logo">
          <span>whitepace</span>
        </Link>

        <div className="menu-icon" onClick={() => setIsOpen(!isOpen)}>
          <i className={isOpen ? "fas fa-times" : "fas fa-bars"}></i>
        </div>

        <ul className={isOpen ? "nav-menu active" : "nav-menu"}>
          {/* Example Menus */}
           <li className="nav-item">
              <Link to="/" className="nav-link">Home</Link>
           </li>
          <li className="nav-item">
            <button
              className="nav-link dropdown-toggle"
              onClick={() => toggleSubmenu("products")}
            >
              Products ▾
            </button>
            <ul className={`submenu ${submenuOpen === "products" ? "show" : ""}`}>
              <li><Link to="/products/a">Product A</Link></li>
              <li><Link to="/products/b">Product B</Link></li>
              <li><Link to="/products/c">Product C</Link></li>
            </ul>
          </li>         

         <li className="nav-item">
            <button
              className="nav-link dropdown-toggle"
              onClick={() => toggleSubmenu("solutions")}
            >
              Solutions ▾
            </button>
            <ul className={`submenu ${submenuOpen === "solutions" ? "show" : ""}`}>
              <li><Link to="/products/a">Solutions A</Link></li>
              <li><Link to="/products/b">Solutions B</Link></li>
              <li><Link to="/products/c">Solutions C</Link></li>
            </ul>
          </li>   

          {/* User Section */}
          {user ? (
            <>
              <li className="nav-item username">
                    <button
                      className="nav-link dropdown-toggle"
                      onClick={() => toggleSubmenu("account")}
                    >
                      Hi, <strong>{user || "Guest"}</strong>
                    </button>
                    <ul className={`submenu ${submenuOpen === "solutions" ? "show" : ""}`}>
                      <li><Link to="/profile">My Account</Link></li>
                    </ul>
                  </li>   
              <li>
                <button onClick={handleLogout} className="btn-login">Logout</button>
              </li>
            </>
          ) : (
            <li>
              <Link to="/login" className="btn-login">Login</Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
