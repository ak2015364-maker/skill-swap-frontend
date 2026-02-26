import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import countryCodes from "../data/countryCodes";

import ThemeToggle from "../components/ThemeToggle";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [college, setCollege] = useState("");
  const [occupation, setOccupation] = useState("");
  const [annualIncome, setAnnualIncome] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [dialCode, setDialCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    const newErrors = {};
    // Email must contain '@'
    if (!email || !email.includes("@")) newErrors.email = "Enter a valid email containing '@'";
    // Phone must be 10 digits numeric
    const numericPhone = phone.replace(/\D/g, "");
    if (!numericPhone || numericPhone.length !== 10) newErrors.phone = "Phone number must be exactly 10 digits";
    if (!dialCode) newErrors.dialCode = "Select country code";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      await API.post("/users/signup", {
        username,
        email,
        password,
        college,
        occupation,
        annualIncome,
        country,
        state,
        phone: dialCode + numericPhone,
      });

      navigate("/login"); // Redirect to login after signup
    } catch (error) {
      console.error(error);
      alert("Signup failed");
    }
  };

  return (
    <div className="card" style={{maxWidth:520,margin:'20px auto',position:'relative'}}>
      <ThemeToggle />
      <h2>Signup</h2>

      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br /><br />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <div style={{color:'red',fontSize:12}}>{errors.email}</div>}
        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br /><br />

        <input
          type="text"
          placeholder="College / Course (optional)"
          value={college}
          onChange={(e) => setCollege(e.target.value)}
        />
        <br /><br />

        <label className="small muted">Occupation</label>
        <select value={occupation} onChange={(e)=>setOccupation(e.target.value)}>
          <option value="">Select...</option>
          <option value="student">Student</option>
          <option value="employed">Employed</option>
          <option value="none">None</option>
        </select>
        <br /><br />

        <input
          type="number"
          placeholder="Annual income (USD, optional)"
          value={annualIncome}
          onChange={(e) => setAnnualIncome(e.target.value)}
        />
        <br /><br />

        <div className="form-row">
          <input type="text" placeholder="Country" value={country} onChange={e=>setCountry(e.target.value)} />
          <input type="text" placeholder="State" value={state} onChange={e=>setState(e.target.value)} />
        </div>
        <br />

        <label className="small muted">Phone</label>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <select value={dialCode} onChange={e=>setDialCode(e.target.value)} style={{minWidth:140}}>
            {countryCodes.map(c=> (
              <option key={c.iso2 + c.code} value={c.code}>{`${c.flag} ${c.name} (${c.code})`}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Phone (10 digits)"
            value={phone}
            onChange={(e)=>{
              // allow only digits and limit to 10 chars
              const cleaned = e.target.value.replace(/\D/g, '');
              setPhone(cleaned.slice(0,10));
            }}
          />
        </div>
        {errors.phone && <div style={{color:'red',fontSize:12}}>{errors.phone}</div>}
        {errors.dialCode && <div style={{color:'red',fontSize:12}}>{errors.dialCode}</div>}
        <br />

        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <button className="btn" type="submit">Signup</button>
          <Link to="/login" style={{color:'var(--accent)'}}>Already have an account?</Link>
        </div>
      </form>
    </div>
  );
}

export default Signup;
