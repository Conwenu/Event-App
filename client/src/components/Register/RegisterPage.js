import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "bootstrap-icons/font/bootstrap-icons.css"; // Import Bootstrap Icons CSS
import "./RegisterPage.css"; // Import custom CSS

function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="register-container">
      {/* Glassmorphism Card */}
      <div className="register-card">
        <div className="card-body">
          <h2 className="fw-bold mb-4 text-center">Register</h2>
          {/* Form Fields */}
          <div className="mb-3">
            <input
              className="form-control"
              id="username"
              type="text"
              placeholder="Username"
            />
          </div>
          <div className="mb-3">
            <input
              className="form-control"
              id="email"
              type="email"
              placeholder="Email"
            />
          </div>
          <div className="mb-3 position-relative">
            <input
              className="form-control"
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
            />
            <i
              className={`password-toggle ${
                showPassword ? "bi-eye-slash" : "bi-eye"
              }`}
              onClick={toggleShowPassword}
            ></i>
          </div>
          {/* Sign up Button */}
          <button className="btn btn-primary w-100 mb-3" type="submit">
            Sign up
          </button>
          {/* Already registered link */}
          <div className="text-center">
            <p className="mb-0">
              Already registered? <a href="/login">Sign in here</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
