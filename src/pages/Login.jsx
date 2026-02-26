import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

import ThemeToggle from "../components/ThemeToggle";

function Login({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post("/users/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      setToken(response.data.token);

      navigate("/"); // Redirect to home after login
    } catch (error) {
      console.error(error);
      alert("Login failed");
    }
  };

  return (
    <div className="card" style={{maxWidth:520,margin:'20px auto',position:'relative'}}>
      <ThemeToggle />
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br /><br />

        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <button className="btn" type="submit">Login</button>
          <Link to="/signup" style={{color:'var(--accent)'}}>Create account</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
