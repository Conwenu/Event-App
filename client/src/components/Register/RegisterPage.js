import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css"; 
import "./RegisterPage.css"; 

function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="register-container">
      
      <div className="register-card">
        <div className="card-body">
          <h2 className="fw-bold mb-4 text-center">Register</h2>
          
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
              className={`register-password-toggle password-toggle ${
                showPassword ? "bi-eye-slash" : "bi-eye"
              }`}
              onClick={toggleShowPassword}
            ></i>
          </div>
          
          <button className="register-button btn w-100 mb-3" type="submit">
            Sign up
          </button>
         
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
