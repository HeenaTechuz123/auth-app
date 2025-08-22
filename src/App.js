// src/App.js
import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import AuthForm from "./components/auth/AuthForm";
import Navbar from "./components/navbar/Navbar";
import Dashboard from "./components/dashboard/Dashboard";
import { AuthProvider } from "./context/AuthContext";
import MyAccount from "./components/myaccount/MyAccount";
import BusinessDetails from "./components/business/BusinessDetails";
import BusinessList from "./components/business/BusinessList";

function AppContent() {
  const location = useLocation();

  // ✅ hide navbar on certain routes
  const hideNavbarRoutes = ["/login"]; // add more routes if needed
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
       {location.pathname === "/login" ? (
        <Routes>
          <Route path="/login" element={<AuthForm />} />
        </Routes>
      ) : (
        <div className="main">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/profile" element={<MyAccount />} />
            <Route path="/businesses" element={<BusinessList />} />
            <Route path="/business/:id" element={<BusinessDetails />} />
          </Routes>
        </div>
      )}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}
