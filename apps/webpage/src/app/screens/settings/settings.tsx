import "./settings.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
  const [searchQuery, setSearchQuery] = useState(""); // Added state for search query
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const [locationsPerPage] = useState(10); // Set the number of locations per page (adjustable)
  const navigate = useNavigate();

  const savedPassword = "userSavedPassword"; // Mock saved password, replace with actual saved password

  // Fetch all locations from the backend
  const fetchLocations = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/locations");
      if (!response.ok) throw new Error("Failed to fetch locations");
      const data = await response.json();
      setLocations(data);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  // Add a new location
  const handleAddLocation = async () => {
    if (!newLocationName.trim()) {
      setErrorMessage("Location name cannot be empty.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/locations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newLocationName }),
      });

      if (!response.ok) throw new Error("Failed to add location");

      const newLocation = await response.json();
      setLocations([...locations, newLocation]);
      setNewLocationName(""); // Clear input after adding
      setErrorMessage(""); // Clear any previous error messages
    } catch (error) {
      console.error("Error adding location:", error);
      setErrorMessage("Error adding location.");
    }
  };

  // Delete a location by its ID
  const handleDeleteLocation = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3000/api/locations/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete location");

      setLocations(locations.filter(location => location.id !== id));
    } catch (error) {
      console.error("Error deleting location:", error);
      setErrorMessage("Error deleting location.");
    }
  };

  // Save the settings (password validation and error handling)
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

  // UseEffect hook to fetch locations when the component mounts
  useEffect(() => {
    fetchLocations();
  }, []);

  // Filter locations based on the search query
  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const indexOfLastLocation = currentPage * locationsPerPage;
  const indexOfFirstLocation = indexOfLastLocation - locationsPerPage;
  const currentLocations = filteredLocations.slice(indexOfFirstLocation, indexOfLastLocation);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="settings-main-container">
      {/* Settings Container */}
      <div className="settings-container">
        <div className="settings-box">
          <h2 className="settings-title">Settings</h2>

          {/* General Settings Panel */}
          <div className="settings-panel">
            <h3 className="panel-title">General Settings</h3>
            {/* Theme and Accessibility Options */}
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
            <button className="save-settings-btn">Save</button>

            {/* User Settings Panel */}
            <h3 className="panel-title">User Settings</h3>
            <button
              className="change-password-btn"
              onClick={() => setShowChangePasswordModal(true)}
            >
              Change Password
            </button>
          </div>

          {/* Location Settings Panel */}
          <div className="settings-panel">
            <h3 className="panel-title">Location Settings</h3>
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
          </div>
        </div>
      </div>

      {/* Search Bar for Location Table */}
      <div className="location-table-container">
      <h3 className="panel-title">Location Search</h3>
        <div className="search-bar">
          <input
            type="text"
            className="settings-input"
            placeholder="Search locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Handle input change
          />
        </div>
        <table>
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
        
        {/* Pagination Controls */}
        <div className="pagination-controls">
          <button 
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage - 1)} 
            disabled={currentPage === 1} // Disable the "Previous" button on the first page
          >
            Previous
          </button>
          <span className="page-number">
            Page {currentPage} of {Math.ceil(filteredLocations.length / locationsPerPage)}
          </span>
          <button 
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage + 1)} 
            disabled={currentPage === Math.ceil(filteredLocations.length / locationsPerPage)} // Disable the "Next" button on the last page
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
