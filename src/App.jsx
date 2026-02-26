import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Requests from "./pages/Requests";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  useEffect(() => {
    if (!token) navigate('/login');
  }, [token]);

  return (
    <div>
      <Header token={token} setToken={setToken} />

      <div className="container">
        <Routes>
          <Route path="/" element={<Home setToken={setToken} />} />
          <Route path="/dashboard" element={<Profile setToken={setToken} />} />
          <Route path="/profile" element={<Profile setToken={setToken} />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default App;
