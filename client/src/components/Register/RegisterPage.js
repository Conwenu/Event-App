import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap Icons CSS
import './RegisterPage.css';

function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      className="container-fluid p-0"
      style={{
        position: 'relative',
        height: '100dvh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Background Image */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url(https://steamuserimages-a.akamaihd.net/ugc/267217313726581113/B6348F0782B755C4278B727643A9C9D0FAFF0AAB/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(8px)',
          zIndex: -1, // Send background image to the back
        }}
      ></div>
      {/* Glassmorphism Card */}
      <div className="card bg-glass shadow-lg" style={{ maxWidth: '500px', width: '100%' }}>
        <div className="card-body p-5">
          <h2 className="fw-bold mb-5 text-center">Register</h2>
          {/* Form Fields */}
          <div className="mb-4">
            <input
              className="form-control"
              id="username"
              type="text"
              placeholder="Username"
            />
          </div>
          <div className="mb-4">
            <input
              className="form-control"
              id="email"
              type="email"
              placeholder="Email"
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
          {/* Sign up Button */}
          <button className="btn btn-primary w-100 mb-4" type="submit">
            Sign up
          </button>
          {/* Already registered link */}
          <div className="text-center">
            <p>
              Already registered? <a href="/signin">Sign in here</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
