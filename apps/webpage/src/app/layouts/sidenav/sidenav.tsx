import { memo, useState, useCallback } from "react";
import { Link, useNavigate } from 'react-router-dom';
import "./sidenav.css";
import logo from "../../../assets/logo.png";
import { useAuth } from "../../contexts/AuthContext";

const SideNav: React.FC = memo(() => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate(); // <-- Get the navigate function

  const { user, logout } = useAuth();

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
    logout()
    navigate('/login'); // <-- Use navigate to redirect to login page
  }, [navigate]); // Dependency on navigate (though it doesn't change)

  return (
    <div className="sidenav bg-gray-800 text-white w-64 h-screen p-4 flex flex-col fixed left-0 top-0">
      <img src={logo} alt="Logo" className="logo" />
      {/* Sidebar Links */}
      {["home", "submission", "audit", "users", "settings"].map((page) => (
        <Link key={page} to={`/${page}`} className="py-2 hover:bg-gray-700 block">
          {page.charAt(0).toUpperCase() + page.slice(1)}
        </Link>
      ))}

      <p className="user-info">Logged in as:<br />{user?.firstName} {user?.lastName}</p>

      {/* Logout Button */}
      <button className="logout-btn" onClick={handleLogout}>Logout</button>

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
    </div>
  );
});

export default SideNav;
