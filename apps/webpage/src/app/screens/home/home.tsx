import "./home.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/logo.png";

export function Home() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="sidenav bg-gray-800 text-white w-64 h-full p-4 flex flex-col">
        <img src={logo} alt="Logo" className="logo" />

        {/* Sidebar Links */}
        {["about", "home", "submission", "audit", "users", "settings", "contact"].map((page) => (
          <a key={page} href={page} className="py-2 hover:bg-gray-700 block">
            {page.charAt(0).toUpperCase() + page.slice(1)}
          </a>
        ))}

        {/* Logout Button */}
        <button className="logout-btn" onClick={() => setShowModal(true)}>Logout</button>
      </div>

      {/* Logout Confirmation Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Are you sure you want to log out?</h3>
            <div className="modal-actions">
              <button className="modal-btn cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="modal-btn confirm" onClick={() => navigate('/login')}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
