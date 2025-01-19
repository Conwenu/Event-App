import React, { useState, useEffect, useRef, useContext } from "react";
import "./UserSettings.css";
import * as Yup from "yup";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useLogout from "../../hooks/useLogout";
import { Formik, Field, Form, ErrorMessage } from "formik";
const AUTH_URL = process.env.REACT_APP_AUTH_URL;
const usernameSchema = Yup.object().shape({
  username: Yup.string()
    .min(8, "Username must be at least 8 characters long")
    .max(20, "Username must be at most 20 characters long")
    .matches(/^[a-zA-Z0-9]+$/, "Username can only contain letters and numbers")
    .required("Please provide a username"),
});
const emailSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please provide a valid email address")
    .required("Please provide an email address"),
});
const passwordSchema = Yup.object().shape({
  currentPassword: Yup.string()
    .required("Current password is required")
    .min(8, "Current password must be at least 8 characters long"),

  newPassword: Yup.string()
    .required("New password is required")
    .min(8, "New password must be at least 8 characters long")
    .max(20, "New password must be at most 20 characters long")
    .notOneOf(
      [Yup.ref("currentPassword"), null],
      "New password cannot be the same as the current password"
    ),

  confirmPassword: Yup.string()
    .required("Please confirm your new password")
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
});
const UserSettings = () => {
  const username = "JohnDoe";
  const email = "JohnDoe@gmail.com";
  const password = "password";
  const [showPassword, setShowPassword] = useState(false);
  const [activeModal, setActiveModal] = useState("");
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();
  const handleLogOut = useLogout();

  const handleModalShow = (modalName) => {
    setActiveModal(modalName);
  };

  const handleModalClose = () => {
    setActiveModal("");
  };

  const usernameInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  // Focus the input field when the modal is shown
  useEffect(() => {
    if (activeModal === "username" && usernameInputRef.current) {
      usernameInputRef.current.focus();
    } else if (activeModal === "email" && emailInputRef.current) {
      emailInputRef.current.focus();
    } else if (activeModal === "password" && passwordInputRef.current) {
      passwordInputRef.current.focus();
    }
  }, [activeModal]);

  const handleChangeUsername = async (values) => {
    try {
      const response = await axiosPrivate.put(`/auth/updateUsername`, values, {
        withCredentials: true,
      });
      if (response.status === 200) {
        handleLogOut();
      }
      setActiveModal(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEmailChange = async (values) => {
    try {
      const response = await axiosPrivate.put(`/auth/updateEmail`, values);
      if (response.status === 200) {
        handleLogOut();
      }
      setActiveModal(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePasswordChange = async (values) => {
    try {
      const response = await axiosPrivate.put(`/auth/updatePassword`, values);
      if (response.status === 200) {
        handleLogOut();
      }
      setActiveModal(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteAccount = async (values) => {
    try {
      const response = await axiosPrivate.delete(`/auth/deleteAccount`, values);
      if (response.status === 200) {
        handleLogOut();
      }
      setActiveModal(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
      <div className="user-settings-container">
        <div className="settings-header">
          <h2 className="settings-title">User Settings</h2>
        </div>
        <div className="settings-body">
          <div className="settings-section">
            <h3 className="section-title">Change Username</h3>
            <form className="section-form" onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="username" className="form-label">
                {`Current Username: ${username}`}
              </label>
              <button
                type="button"
                className="form-button"
                onClick={() => handleModalShow("username")}
              >
                Update Username
              </button>
            </form>
          </div>
          <div className="settings-section">
            <h3 className="section-title">Change Email</h3>
            <form className="section-form" onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="email" className="form-label">
                {`Current Email: ${email}`}
              </label>
              <button
                type="button"
                className="form-button"
                onClick={() => handleModalShow("email")}
              >
                Update Email
              </button>
            </form>
          </div>
          <div className="settings-section">
            <h3 className="section-title">Change Password</h3>
            <form className="section-form" onSubmit={(e) => e.preventDefault()}>
              <label
                htmlFor="password"
                className="form-label"
                style={{ display: "flex", justifyContent: "space-between" }}
              ></label>
              <button
                type="button"
                className="form-button"
                onClick={() => handleModalShow("password")}
              >
                Update Password
              </button>
            </form>
          </div>
          <div className="settings-section">
            <h3 className="section-title">Delete Account</h3>
            <p className="section-warning">
              Warning: This action is irreversible.
            </p>
            <form className="section-form" onSubmit={(e) => e.preventDefault()}>
              <button
                type="button"
                className="form-button delete-button"
                onClick={() => handleModalShow("deleteAccount")}
              >
                Delete Account
              </button>
            </form>
          </div>
        </div>

        {activeModal === "username" && (
          <div
            className="modal show"
            tabIndex="-1"
            style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Update Username</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleModalClose}
                  ></button>
                </div>
                <div className="modal-body">
                  <Formik
                    initialValues={{ username: "" }}
                    validationSchema={usernameSchema}
                    onSubmit={handleChangeUsername}
                  >
                    {() => (
                      <Form>
                        <label
                          className="change-username-form-label"
                          htmlFor="username"
                        >
                          Username
                        </label>
                        <div className="mb-3">
                          <Field
                            innerRef={usernameInputRef} // Set ref here to focus
                            className="form-control"
                            id="username"
                            name="username"
                            type="text"
                            placeholder="Enter new username"
                          />
                          <ErrorMessage
                            name="username"
                            component="div"
                            className="text-danger"
                          />
                        </div>
                        <div className="modal-footer">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleModalClose}
                          >
                            Close
                          </button>
                          <button
                            type="submit"
                            className="btn user-settings-modal-button"
                          >
                            Save Changes
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeModal === "email" && (
          <div
            className="modal show"
            tabIndex="-1"
            style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Update Username</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleModalClose}
                  ></button>
                </div>
                <div className="modal-body">
                  <Formik
                    initialValues={{ email: "" }}
                    validationSchema={emailSchema}
                    onSubmit={handleEmailChange}
                  >
                    {() => (
                      <Form>
                        <label
                          className="change-email-form-label"
                          htmlFor="email"
                        >
                          Email
                        </label>
                        <div className="mb-3">
                          <Field
                            innerRef={emailInputRef} // Set ref here to focus
                            className="form-control"
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter new email"
                          />
                          <ErrorMessage
                            name="email"
                            component="div"
                            className="text-danger"
                          />
                        </div>
                        <div className="modal-footer">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleModalClose}
                          >
                            Close
                          </button>
                          <button
                            type="submit"
                            className="btn user-settings-modal-button"
                          >
                            Save Changes
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeModal === "password" && (
          <div
            className="modal show"
            tabIndex="-1"
            style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Update Password</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleModalClose}
                  ></button>
                </div>
                <div className="modal-body">
                  <Formik
                    initialValues={{
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    }}
                    validationSchema={passwordSchema} // validation schema with Yup
                    onSubmit={handlePasswordChange} // handle form submission
                  >
                    {({ setFieldValue }) => (
                      <Form>
                        {/* Current Password Field */}
                        <label
                          className="change-password-form-label"
                          htmlFor="currentPassword"
                        >
                          Current Password
                        </label>
                        <div className="mb-3">
                          <Field
                            className="form-control"
                            id="currentPassword"
                            name="currentPassword"
                            type="password"
                            placeholder="Enter current password"
                          />
                          <ErrorMessage
                            name="currentPassword"
                            component="div"
                            className="text-danger"
                          />
                        </div>

                        {/* New Password Field */}
                        <label
                          className="change-password-form-label"
                          htmlFor="newPassword"
                        >
                          New Password
                        </label>
                        <div className="mb-3">
                          <Field
                            className="form-control"
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            placeholder="Enter new password"
                          />
                          <ErrorMessage
                            name="newPassword"
                            component="div"
                            className="text-danger"
                          />
                        </div>

                        {/* Confirm Password Field */}
                        <label
                          className="change-password-form-label"
                          htmlFor="confirmPassword"
                        >
                          Confirm New Password
                        </label>
                        <div className="mb-3">
                          <Field
                            className="form-control"
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="Re-enter new password"
                          />
                          <ErrorMessage
                            name="confirmPassword"
                            component="div"
                            className="text-danger"
                          />
                        </div>

                        {/* Modal Footer */}
                        <div className="modal-footer">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleModalClose}
                          >
                            Close
                          </button>
                          <button
                            type="submit"
                            className="btn user-settings-modal-button"
                          >
                            Save Changes
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeModal === "deleteAccount" && (
          <div
            className="modal show"
            tabIndex="-1"
            style={{
              display: "block",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1050,
            }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Delete Account</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleModalClose}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>
                    Are you sure you want to delete your account? This action is
                    irreversible.
                  </p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleModalClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleDeleteAccount}
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserSettings;
