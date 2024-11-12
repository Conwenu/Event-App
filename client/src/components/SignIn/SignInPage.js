import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './SignInPage.css';

function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (

      <div
        className="card bg-glass shadow-lg"
        style={{ maxWidth: '500px', width: '100%' }}
      >
        <div className="card-body p-5">
          <h2 className="fw-bold mb-5 text-center">Sign In</h2>
          {/* Form Fields */}
          <div className="mb-4">
            <input
              className="form-control"
              id="usernameoremail"
              type="email"
              placeholder="Username or Email"
            />
          </div>
          <div className="mb-4 position-relative">
            <input
              className="form-control"
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
            />
            <i
              className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'pointer'
              }}
              onClick={toggleShowPassword}
            ></i>
          </div>
          {/* Sign in Button */}
          <button className="btn btn-primary w-100 mb-4" type="submit">
            Sign In
          </button>
          {/* Sign up link */}
          <div className="text-center">
            <p>
              Don't have an account? <a href="/register">Register here</a>
            </p>
          </div>
        </div>
      
    </div>
  );
}

export default SignInPage;
