// src/context/AuthContext.js
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Load user from localStorage on first render
  useEffect(() => {
    const storedUser = localStorage.getItem("userName");
    if (storedUser) setUser(storedUser);
  }, []);

  // ✅ Login function
  const login = (name) => {
    localStorage.setItem("userName", name);
    setUser(name);
  };

  // ✅ Logout function
  const logout = () => {
    localStorage.removeItem("userName");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
