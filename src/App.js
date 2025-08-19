import './App.css';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import AuthForm from "./components/auth/AuthForm";
import Navbar from "./components/navbar/Navbar";
import Dashboard from "./components/dashboard/Dashboard";

function AppContent() {
  const location = useLocation();

  // hide navbar on auth page
  const hideNavbarRoutes = ["/"]; // add more routes if needed
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <AppContent />
    </BrowserRouter>
  );
}
