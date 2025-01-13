import React, { useState } from "react";
import {useNavigate} from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./SignInPage.css";
import * as Yup from "yup"
import { Formik, Field, Form, ErrorMessage } from "formik"
import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL;
const AUTH_URL = process.env.REACT_APP_AUTH_URL;
const signInSchema = Yup.object().shape({
  usernameOrEmail: Yup.string()
    .required("Please provide a username or email")
    .test("email-or-username", "Invalid username or email", (value) => {
      const isEmailValid = Yup.string().email().isValidSync(value);
      const isUsernameValid = /^[a-zA-Z0-9]+$/.test(value);
      return isEmailValid || isUsernameValid; 
    }),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters long")
    .max(20, "Password must be at most 20 characters long")
    .required("Please provide a password"),
});

function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSignIn = async (values) => {
    try {
      const newValues = {
        email: values.usernameOrEmail, 
        username: values.usernameOrEmail,
        password: values.password
      };
      axios.defaults.withCredentials = true;
      const response = await axios.post(`${AUTH_URL}/login`, newValues);
      console.log(response);
      // Set auth when true?
      navigate("/");
    } catch (error) {
      console.error("Error Signing In:", error.response.data.error);
    }
    
  }

  return (
    <div className="signin-container">
      <div className="signin-card">
        <div className="card-body">
          <h2 className="fw-bold mb-4 text-center">Sign In</h2>
          <Formik
            initialValues={{ usernameOrEmail: "", password: "" }}
            validationSchema={signInSchema}
            onSubmit={handleSignIn}
          >
            {() => (
              <Form>
                
                <div className="mb-3">
                  <label className="signin-form-label" htmlFor="usernameOrEmail">Username or Email</label>
                  <Field
                    className="form-control"
                    id="usernameOrEmail"
                    name="usernameOrEmail"
                    type="text"
                    placeholder="Username or Email"
                  />
                  <ErrorMessage name="usernameOrEmail" component="div" className="text-danger" />
                </div>

         
                <div className="mb-3 position-relative">
                <label className="signin-form-label" htmlFor="password">Password</label>
                  <Field
                    className="form-control"
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                  />
                  <i
                    className={`signin-password-toggle password-toggle ${
                      showPassword ? "bi-eye-slash" : "bi-eye"
                    }`}
                    onClick={toggleShowPassword}
                  ></i>
                  <ErrorMessage name="password" component="div" className="text-danger" />
                </div>

                
                <button className="signin-button btn w-100 mb-3" type="submit">
                  Sign In
                </button>
              </Form>
            )}
          </Formik>
     
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
