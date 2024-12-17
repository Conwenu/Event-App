import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./SignInPage.css";

function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="signin-container">
      <div className="signin-card">
        <div className="card-body">
          <h2 className="fw-bold mb-4 text-center">Sign In</h2>
          {/* Form Fields */}
          <div className="mb-3">
            <input
              className="form-control"
              id="usernameoremail"
              type="email"
              placeholder="Username or Email"
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
              className={`signin-password-toggle password-toggle ${
                showPassword ? "bi-eye-slash" : "bi-eye"
              }`}
              onClick={toggleShowPassword}
            ></i>
          </div>
          {/* Sign in Button */}
          <button className="signin-button btn w-100 mb-3" type="submit">
            Sign In
          </button>
          {/* Sign up link */}
          <div className="text-center">
            <p className="mb-0">
              Don't have an account? <a href="/signup">Register here</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignInPage;
