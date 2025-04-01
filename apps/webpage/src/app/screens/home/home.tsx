import "./home.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/logo.png";

export function Home() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex h-screen">
        <h1 className="text-3xl font-bold">Home screen</h1>
    </div>
  );
}

export default Home;
