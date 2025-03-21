import { memo } from "react";
import "./sidenav.css";
import logo from "../../../assets/logo.png";
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- Import useNavigate

const SideNav: React.FC<{ children: React.ReactNode }> = memo(({ children }) => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate(); // <-- Get the navigate function

  // Memoize the function to open the modal
  const handleLogout = useCallback(() => {
    setShowModal(true);
  }, []); // No dependencies, so this function is the same for every render

  // Memoize the function to close the modal
  const handleCloseModal = useCallback(() => {
    setShowModal(false);
  }, []); // No dependencies, so this function is the same for every render

  // Handle logout confirmation
  const handleConfirmLogout = useCallback(() => {
    // Perform logout logic (e.g., clearing authentication data)
    navigate('/login'); // <-- Use navigate to redirect to login page
  }, [navigate]); // Dependency on navigate (though it doesn't change)
    
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="sidenav bg-gray-800 text-white w-64 h-full p-4 flex flex-col">
        <img src={logo} alt="Logo" className="logo" />
        {/* Sidebar Links */}
        {["home", "submission", "audit", "users", "settings"].map((page) => (
          <a key={page} href={page} className="py-2 hover:bg-gray-700 block">
            {page.charAt(0).toUpperCase() + page.slice(1)}
          </a>
        ))}

        {/* Logout Button */}
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      {/* Logout Confirmation Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Are you sure you want to log out?</h3>
            <div className="modal-actions">
              <button className="modal-btn cancel" onClick={handleCloseModal}>Cancel</button>
              <button className="modal-btn confirm" onClick={handleConfirmLogout}>Confirm</button>
            </div>
          </div>
        </div>
      )}
      <div className="settings-container flex-1 flex justify-center items-center p-6">
        {children}
      </div>
    </div>
  );
});

export default SideNav;

