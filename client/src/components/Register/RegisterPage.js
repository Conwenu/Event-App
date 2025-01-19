import React, { useState } from "react";
import {useNavigate} from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css"; 
import "./RegisterPage.css"; 
import * as Yup from "yup"
import { Formik, Field, Form, ErrorMessage } from "formik"
import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL;
const AUTH_URL = process.env.REACT_APP_AUTH_URL;

const registrationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please provide a valid email address")
    .required("Please provide an email address"),
  username: Yup.string()
    .min(8, "Username must be at least 8 characters long")
    .max(20, "Username must be at most 20 characters long")
    .matches(
      /^[a-zA-Z0-9]+$/,
      "Username can only contain letters and numbers"
    )
    .required("Please provide a username"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters long")
    .max(20, "Password must be at most 20 characters long")
    .required("Please provide a Password"),
});
function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const handleRegistration = async (values) => {
    try {
      const response = await axios.post(`${AUTH_URL}/register`, values);
      
      if (response.status === 200) {
        navigate("/login");
      }
    } catch (error) {
      console.error("Error registering:", error.response.data.error);
    }
  };


  return (
    <div className="register-container">
      
      <div className="register-card">
        <div className="card-body">
          <h2 className="fw-bold mb-4 text-center">Register</h2>
          
          <Formik
            initialValues={{ email: "", username: "", password: "" }}
            validationSchema={registrationSchema}
            onSubmit={handleRegistration}
          >
            {({ setFieldValue }) => (
              <Form>
                 <label className = "register-form-label" htmlFor="username">Username</label>
                <div className="mb-3">
                  <Field
                    className="form-control"
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Username"
                  />
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="text-danger"
                  />
                </div>

                <div className="mb-3">
                <label className = "register-form-label" htmlFor="email">Email</label>
                  <Field
                    className="form-control"
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-danger"
                  />
                </div>


                <div className="mb-3 position-relative">
                <label className = "register-form-label" htmlFor="password">Password</label>
                  <Field
                    className="form-control"
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-danger"
                  />
                </div>

                {/* Submit Button */}
                <button className="register-button btn w-100 mb-3" type="submit">
                  Sign up
                </button>
              </Form>
            )}
          </Formik>
         
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
