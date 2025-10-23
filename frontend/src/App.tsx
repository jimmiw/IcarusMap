import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import Login from "./Login";
import MapPage from "./Map";

export default function App() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));

  // Save token to localStorage whenever it changes
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  const isAuthenticated = !!token;

  const handleLogout = () => {
    setToken(null); // clears state and localStorage
  };

  return (
    <Router>
      <div>
        {isAuthenticated && (
          <button onClick={handleLogout} style={{ position: "absolute", top: 10, right: 10 }}>
            Logout
          </button>
        )}
      </div>
      <Routes>
        <Route path="/login" element={<Login onLogin={setToken} />} />
        <Route
          path="/map"
          element={isAuthenticated ? <MapPage token={token} /> : <Navigate to="/login" replace />}
        />
        <Route path="*" element={<Navigate to={isAuthenticated ? "/map" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}
