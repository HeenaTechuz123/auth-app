import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.scss";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // mobile menu
  const [submenuOpen, setSubmenuOpen] = useState(null); // track which submenu is open
  const [user, setUser] = useState(null); // store logged-in user
  const navigate = useNavigate();

  useEffect(() => {
    // get user info from localStorage
    const storedUser = localStorage.getItem("userName");
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const toggleSubmenu = (menu) => {
    if (submenuOpen === menu) {
      setSubmenuOpen(null);
    } else {
      setSubmenuOpen(menu);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userName");
    setUser(null);
    navigate("/"); // redirect to home/login page
  };

  return (
    <nav className="navbar">
      <div className="container">
        {/* Logo */}
        <Link to="/" className="nav-logo">
          <span>whitepace</span>
        </Link>

        {/* Hamburger for mobile */}
        <div className="menu-icon" onClick={() => setIsOpen(!isOpen)}>
          <i className={isOpen ? "fas fa-times" : "fas fa-bars"}></i>
        </div>

        {/* Main Menu */}
        <ul className={isOpen ? "nav-menu active" : "nav-menu"}>
          {/* Products */}
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

          {/* Solutions */}
          <li className="nav-item">
            <button 
              className="nav-link dropdown-toggle"
              onClick={() => toggleSubmenu("solutions")}
            >
              Solutions ▾
            </button>
            <ul className={`submenu ${submenuOpen === "solutions" ? "show" : ""}`}>
              <li><Link to="/solutions/a">Solution A</Link></li>
              <li><Link to="/solutions/b">Solution B</Link></li>
            </ul>
          </li>

          {/* Resources */}
          <li className="nav-item">
            <button 
              className="nav-link dropdown-toggle"
              onClick={() => toggleSubmenu("resources")}
            >
              Resources ▾
            </button>
            <ul className={`submenu ${submenuOpen === "resources" ? "show" : ""}`}>
              <li><Link to="#">Docs</Link></li>
              <li><Link to="#">Blog</Link></li>
              <li><Link to="#">Help Center</Link></li>
            </ul>
          </li>

          {/* Pricing */}
          <li className="nav-item">
            <Link to="#" className="nav-link">Pricing</Link>
          </li>

          {/* Auth Buttons */}
          {user ? (
            <>
              <li className="nav-item username">Hi, <strong>{user}</strong></li>
              <li>
                <button onClick={handleLogout} className="btn-login">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link to="/" className="btn-login">Login</Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
