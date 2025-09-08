// src/context/AuthContext.js
import { createContext, useState, useEffect,useContext } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // ✅ Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("❌ Failed to parse stored user:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  // ✅ Add a function to refresh user data from the API
  const refreshUser = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.log("⚠️ No userId found to refresh user data.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5001/api/users/${userId}`);
      if (res.ok) {
        const updatedUser = await res.json();
        // Update both state and localStorage with the new data
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        console.log("🔄 User data refreshed from server.");
      } else {
        console.error("❌ Failed to refresh user data:", await res.json());
      }
    } catch (err) {
      console.error("❌ Network error while refreshing user:", err);
    }
  };

  // ✅ Save user to state + localStorage
  const login = (userData) => {
    if (!userData) return;
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  // ✅ Clear user from state + localStorage
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout,refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}
