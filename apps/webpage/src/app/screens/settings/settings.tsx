import "./settings.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/logo.png";

export function Settings() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [theme, setTheme] = useState("Light");
  const [highContrast, setHighContrast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const savedPassword = "userSavedPassword"; // Mock saved password, replace with actual saved password

  const handleSave = () => {
    // Password Validation Logic
    if (currentPassword !== savedPassword) {
      setErrorMessage("Current password is incorrect.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage("New password must be at least 6 characters.");
      return;
    }

    // If validation passes
    setErrorMessage(""); // Clear any previous error messages
    console.log("Password changed:", { newPassword });
    setShowChangePasswordModal(false); // Close modal after password change
  };

  return (
    <div className="flex h-screen">
      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <div className="change-password-modal-overlay">
          <div className="modal">
            <h3>Change Password</h3>

            {/* Password Change Form */}
            <label className="settings-label">
              Current Password:
              <input
                type="password"
                placeholder="Current Password"
                className="settings-input"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </label>

            <label className="settings-label">
              New Password:
              <input
                type="password"
                placeholder="New Password"
                className="settings-input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </label>

            <label className="settings-label">
              Confirm New Password:
              <input
                type="password"
                placeholder="Confirm New Password"
                className="settings-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </label>

            {/* Display Error Messages */}
            {errorMessage && <div className="error-message">{errorMessage}</div>}

            <div className="modal-actions">
              <button className="modal-btn cancel" onClick={() => setShowChangePasswordModal(false)}>Cancel</button>
              <button className="modal-btn confirm" onClick={handleSave}>Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Container */}
      <div className="settings-container flex-1 flex justify-center items-center p-6">
        <div className="settings-box">
          <h2 className="settings-title">Settings</h2>

          {/* Theme Selection */}
          <label className="settings-label">
            Theme:
            <select
              className="settings-input"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            >
              <option>Light</option>
              <option>Dark</option>
            </select>
          </label>

          {/* Accessibility Option */}
          <label className="settings-label checkbox-label">
            <input
              type="checkbox"
              checked={highContrast}
              onChange={(e) => setHighContrast(e.target.checked)}
            />
            Enable High Contrast
          </label>

          {/* Save Settings Button */}
          <button className="save-settings-btn" >
            Save
          </button>

          {/* Change Password Button */}
          <button className="change-password-btn" onClick={() => setShowChangePasswordModal(true)}>
            Change Password
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Are you sure you want to log out?</h3>
            <div className="modal-actions">
              <button className="modal-btn cancel" onClick={() => setShowLogoutModal(false)}>Cancel</button>
              <button className="modal-btn confirm" onClick={() => navigate('/login')}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;
