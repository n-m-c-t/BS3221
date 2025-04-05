import "./home.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/logo.png";

export function Home() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="home-screen-container">
        <div className="home-screen-pane">
          <h3>HOME SCREEN PANE</h3>
        </div>
        <div className="home-screen-pane">
          <h3>HOME SCREEN PANE 2</h3>
        </div>
        <div className="home-screen-pane">
          <h3>HOME SCREEN PANE 3</h3>
        </div>                
    </div>
  );
}

export default Home;
