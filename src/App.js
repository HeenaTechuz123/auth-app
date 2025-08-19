import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthForm from "./components/auth/AuthForm";
import Dashboard from "./components/dashboard/Dashboard";

function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;