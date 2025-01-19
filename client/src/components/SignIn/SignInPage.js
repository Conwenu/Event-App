import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./SignInPage.css";
import * as Yup from "yup";
import { toast } from 'react-toastify';
import { Formik, Field, Form, ErrorMessage } from "formik";
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
  const { setAuth, persist, setPersist } = useAuth();
  // const {auth} = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  

  const handleSignIn = async (values) => {
    try {
      const newValues = {
        email: values.usernameOrEmail,
        username: values.usernameOrEmail,
        password: values.password,
      };
      axios.defaults.withCredentials = true;
      const response = await axios.post(`${AUTH_URL}/login`, newValues, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      const user = response?.data?.user;
      const accessToken = response?.data?.accessToken;
      setAuth({
        user : user,
        id: user?.id,
        username: user?.username,
        email: user?.email,
        accessToken : accessToken,
      });
      navigate(from, {replace: true});
    } catch (error) {
      if(!error?.response)
      {
        toast.error('No Server Response');
      }
        toast.error(`Error Signing In: ${error}`);
    }
  };

  const togglePersist = () => {
    setPersist(prev => !prev);
  }

  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist])

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
                  <label
                    className="signin-form-label"
                    htmlFor="usernameOrEmail"
                  >
                    Username or Email
                  </label>
                  <Field
                    className="form-control"
                    id="usernameOrEmail"
                    name="usernameOrEmail"
                    type="text"
                    placeholder="Username or Email"
                  />
                  <ErrorMessage
                    name="usernameOrEmail"
                    component="div"
                    className="text-danger"
                  />
                </div>

                <div className="mb-3 position-relative">
                  <label className="signin-form-label" htmlFor="password">
                    Password
                  </label>
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

                <button className="signin-button btn w-100 mb-3" type="submit">
                  Sign In
                </button>
              </Form>
            )}
          </Formik>

          <div className="text-center">
            <p className="mb-0">
              Forgot Password? <a href="/signup">Click here</a>
            </p>
            <p className="mb-0">
              Don't have an account? <a href="/signup">Register here</a>
            </p>
          
            <p className="mb-0">
            <input type='checkbox' onChange={togglePersist} checked={persist} id="persist"></input>
              {" Keep Me Logged In"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignInPage;
