import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import fallbackImage from "../assets/images/Avatars/Avatar_4.svg";
import LogotypeLink from "../partials/components/LogotypeLink";

const SignUp = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    image: { fallbackImage },
  });
  const [error, setError] = useState("");
  const [acceptTerms, setAcceptTerms] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.firstName.trim() === "") {
      setError("Enter first name.");
      return;
    }

    if (formData.lastName.trim() === "") {
      setError("Enter last name.");
      return;
    }

    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Incorrect email format.");
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setError(
        "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character."
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!acceptTerms) {
      setError("You must accept the Terms and Conditions.");
      return;
    }

    const succeeded = await signUp(formData);
    if (succeeded) {
      navigate("/auth/signin");
    } else {
      setError("Sign-up failed. Please try again.");
    }
  };

  return (
    <>
      <div id="signup" className="card">
        <div className="card-header">
          <h1>Create Account</h1>
        </div>
        <div className="card-body">
          <form noValidate onSubmit={handleSubmit}>
            <div className="form-group">
              <label>First Name:</label>
              <input
                type="text"
                name="firstName"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Last Name:</label>
              <input
                type="text"
                name="lastName"
                placeholder="Enter your last name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Confirm password:</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  style={{ width: "10px", height: "10px" }}
                />{" "}
                I accept <a href="#">Terms and Conditions</a>
              </label>
            </div>

            {error && <p className="error">{error}</p>}

            <button className="btn btn-sign" type="submit">
              Create Account
            </button>
          </form>
          <p>
            Already have an account? <Link to="/auth/signin">Login</Link>
          </p>
        </div>
      </div>
      <div className="logo-sign">
        <LogotypeLink />
      </div>
    </>
  );
};

export default SignUp;
