import React, { useState } from "react";
import "./UserSettings.css";
import * as Yup from "yup";
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
  password: Yup.string()
    .min(8, "Password must be at least 8 characters long")
    .max(20, "Password must be at most 20 characters long")
    .required("Please provide a Password"),
});
const UserSettings = () => {
  const username = "JohnDoe";
  const email = "JohnDoe@gmail.com";
  const password = "password";
  const [showPassword, setShowPassword] = useState(false);
  const [activeModal, setActiveModal] = useState("");
  const [currentPasswordInput, setCurrentPasswordInput] = useState("");
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [confirmPasswordInput, setConfirmPasswordInput] = useState("");

  const handleModalShow = (modalName) => {
    setActiveModal(modalName);
  };

  const handleModalClose = () => {
    setActiveModal("");
  };

  const handlePasswordUpdate = () => {
    if (!currentPasswordInput || !newPasswordInput || !confirmPasswordInput) {
      alert("All fields are required.");
      return;
    }
    if (newPasswordInput !== confirmPasswordInput) {
      alert("New passwords do not match.");
      return;
    }
    // API call
    alert("Password updated successfully!");
    handleModalClose();
  };

  const handleDeleteAccount = () => {
    console.log("Account deleted");
    setActiveModal(null);
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
              >
                {`Current Password: ${
                  showPassword ? password : "************"
                }`}
                <i
                  className={`bi ${!showPassword ? "bi-eye" : "bi-eye-slash"}`}
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ cursor: "pointer", marginLeft: "10px" }}
                ></i>
              </label>
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
                  <input
                    type="text"
                    id="newUsername"
                    className="form-control"
                    placeholder="Enter new username"
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
                    type="button"
                    className="btn user-settings-modal-button"
                  >
                    Save Changes
                  </button>
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
                  <h5 className="modal-title">Update Email</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleModalClose}
                  ></button>
                </div>
                <div className="modal-body">
                  <input
                    type="email"
                    id="newEmail"
                    className="form-control"
                    placeholder="Enter new email"
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
                    type="button"
                    className="btn user-settings-modal-button"
                  >
                    Save Changes
                  </button>
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
                  <form>
                    <div className="mb-3">
                      <input
                        type="password"
                        id="currentPassword"
                        className="form-control"
                        placeholder="Enter current password"
                        value={currentPasswordInput}
                        onChange={(e) =>
                          setCurrentPasswordInput(e.target.value)
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="password"
                        id="newPassword"
                        className="form-control"
                        placeholder="Enter new password"
                        value={newPasswordInput}
                        onChange={(e) => setNewPasswordInput(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="password"
                        id="confirmPassword"
                        className="form-control"
                        placeholder="Re-enter new password"
                        value={confirmPasswordInput}
                        onChange={(e) =>
                          setConfirmPasswordInput(e.target.value)
                        }
                      />
                    </div>
                  </form>
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
                    type="button"
                    className="btn btn-primary user-settings-modal-button"
                    onClick={handlePasswordUpdate}
                  >
                    Save Changes
                  </button>
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
