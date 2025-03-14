import './home.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "../../../assets/logo.png";

export function Home() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setShowModal(false);
    navigate('/login');
  };

  const handleCancel = () => {
    setShowModal(false);
  };


  return (
    <div className="flex h-screen">
      <div className="sidenav bg-gray-800 text-white w-64 h-full p-4 flex flex-col space-y-4">
      <img src={logo} alt="Logo" className="logo" />
        <a href="about" className="py-2 hover:bg-gray-700 block">About</a>
        <a href="location" className="py-2 hover:bg-gray-700 block">Location</a>
        <a href="contact" className="py-2 hover:bg-gray-700 block">Contact</a>
        <button 
          className="logout-btn"
          onClick={() => setShowModal(true)}
        >
          Logout
        </button>
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Are you sure you want to log out?</h2>
            <div className="modal-actions">
              <button className="modal-btn cancel" onClick={handleCancel}>Cancel</button>
              <button className="modal-btn confirm" onClick={handleLogout}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>

    
  );
}
  
  export default Home;