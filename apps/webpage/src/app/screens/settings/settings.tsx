import "./settings.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import API from '../../axiosInstance';

export function Settings() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [theme, setTheme] = useState("Light");
  const [highContrast, setHighContrast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [locations, setLocations] = useState<{ id: number; name: string }[]>([]);
  const [newLocationName, setNewLocationName] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [locationsPerPage] = useState(7);

  const navigate = useNavigate();
  const { user, hasRole } = useAuth();

  // Fetch all locations
  const fetchLocations = async () => {
    try {
      const response = await API.get("/locations");
      setLocations(response.data);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const handleAddLocation = async () => {
    if (!newLocationName.trim()) {
      setErrorMessage("Location name cannot be empty.");
      return;
    }

    try {
      const response = await API.post("/locations", { name: newLocationName });
      setLocations([...locations, response.data]);
      setNewLocationName("");
      setErrorMessage("");
    } catch (error) {
      console.error("Error adding location:", error);
      setErrorMessage("Error adding location.");
    }
  };

  // settings.tsx (or wherever you're handling deletion)
  const handleDeleteLocation = async (locationId: number) => {
    if (window.confirm('Are you sure you want to delete this location?')) {
      try {
        const response = await API.delete(`/locations/${locationId}`);
        const { affectedSessions } = response.data;
        alert(`Location deleted successfully! ${affectedSessions} session(s) affected.`);
        // Optionally refresh the locations list or update the UI
      } catch (error) {
        console.error('Error deleting location:', error);
        alert('An error occurred while deleting the location.');
      }
    fetchLocations()
    }
  };

  const handleSave = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrorMessage("All fields are required.");
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

    try {
      await API.patch(`/users/${user?.id}/password`, {
        current: currentPassword,
        newPass: newPassword,
      });

      setShowChangePasswordModal(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setErrorMessage("");
      alert("Password successfully updated.");
    } catch (err: any) {
      const message = err?.response?.data?.message || "Failed to update password.";
      setErrorMessage(message);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastLocation = currentPage * locationsPerPage;
  const indexOfFirstLocation = indexOfLastLocation - locationsPerPage;
  const currentLocations = filteredLocations.slice(indexOfFirstLocation, indexOfLastLocation);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="settings-container">
      <div className="settings-pane">
        <h3>Usability, User & Location Settings</h3>
        <h4>Accessibility Settings</h4>

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

        <label className="settings-label checkbox-label">
          <input
            type="checkbox"
            checked={highContrast}
            onChange={(e) => setHighContrast(e.target.checked)}
          />
          Enable High Contrast
        </label>

        <h4 className="panel-title">User Settings</h4>
        <button
          className="change-password-btn"
          onClick={() => setShowChangePasswordModal(true)}
        >
          Change Password
        </button>

        {/* Admin-only section for adding and searching locations */}
        {hasRole("admin") && (
          <>
            <h4>Add Location</h4>
            <div className="add-location-form">
              <input
                type="text"
                value={newLocationName}
                onChange={(e) => setNewLocationName(e.target.value)}
                placeholder="Enter new location name"
                className="settings-input"
              />
              <button onClick={handleAddLocation} className="save-settings-btn">
                Add Location
              </button>
              {errorMessage && <div className="error-message">{errorMessage}</div>}
            </div>
          </>
        )}
      </div>

      {hasRole("admin") && (
      <div className="settings-pane">
        <h3>Location Search</h3>
        <div className="search-bar">
          <input
            type="text"
            className="settings-input"
            placeholder="Search locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <table className="location-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentLocations.map((location) => (
              <tr key={location.id}>
                <td>{location.name}</td>
                <td>
                  <button
                    className="delete"
                    onClick={() => handleDeleteLocation(location.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination-controls">
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="page-number">
            Page {currentPage} of {Math.ceil(filteredLocations.length / locationsPerPage)}
          </span>
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === Math.ceil(filteredLocations.length / locationsPerPage)}
          >
            Next
          </button>
        </div>
      </div>
        )}
        
      {showChangePasswordModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>Password Reset</h2>
            <p>Reset for <strong>{user?.firstName} {user?.lastName}</strong></p>
            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="settings-input"
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="settings-input"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="settings-input"
            />
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <div className="modal-actions">
              <button onClick={handleSave} className="save-settings-btn">Change</button>
              <button onClick={() => setShowChangePasswordModal(false)} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;
