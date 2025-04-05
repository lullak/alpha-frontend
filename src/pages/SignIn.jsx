import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import LogotypeLink from "../partials/components/LogotypeLink";
const SignIn = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const succeeded = await signIn(email, password);
    if (succeeded) {
      navigate("/projects");
    } else {
      setError("Login failed.");
    }
  };

  return (
    <>
      <div id="signin" className="card modal-content">
        <div className="card-header">
          <h1>Login</h1>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="error">{error}</p>}
            <button className="btn btn-sign" type="submit">
              Log In
            </button>
          </form>
          <p>
            Don't have an account? <Link to="/auth/signup">Sign Up</Link>
          </p>
        </div>
      </div>
      <div className="logo-sign">
        <LogotypeLink />
      </div>
    </>
  );
};

export default SignIn;
