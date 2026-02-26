import { Link } from "react-router-dom";

export default function Header({ token, setToken }) {
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <header className="container card header">
      <div className="logo">
        <div className="mark">SS</div>
        <div>
          <div style={{fontWeight:700}}>SkillSwap</div>
          <div className="small muted">Learn. Teach. Connect.</div>
        </div>
      </div>

      <nav className="nav">
        <Link to="/" style={{textDecoration:'none'}}><button>Home</button></Link>
        <Link to="/profile" style={{textDecoration:'none'}}><button>Profile</button></Link>
        <Link to="/requests" style={{textDecoration:'none'}}><button>Requests</button></Link>
        {!token && <Link to="/signup" style={{textDecoration:'none'}}><button>Get Started</button></Link>}
        {token ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <Link to="/login" style={{textDecoration:'none'}}><button>Login</button></Link>
        )}
      </nav>
    </header>
  );
}
