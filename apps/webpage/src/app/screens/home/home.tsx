import "./home.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../axiosInstance";
import { useAuth } from "../../contexts/AuthContext";


export function Home() {
  const { user, hasRole} = useAuth();
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [activeSession, setActiveSession] = useState(null);

  const userID = user?.id || 0;
  const navigate = useNavigate();

  useEffect(() => {
    fetchLocations();
    checkActiveSession();
  }, []);

  const fetchLocations = async () => {
    try {
      const res = await API.get("/locations");
      setLocations(res.data);
    } catch (error) {
      console.error("Failed to fetch locations:", error);
    }
  };

  const checkActiveSession = async () => {
    try {
      const res = await API.get(`/submissions/user/${userID}`);
      const openSession = res.data.find((s) => !s.exitTime);
      setActiveSession(openSession || null);
    } catch (error) {
      console.error("Failed to fetch submissions:", error);
    }
  };

  const handleStartSession = async () => {
    if (!selectedLocation) return alert("Please select a location");

    try {
      await API.post("/submissions", {
        entryTime: new Date().toISOString(),
        userID,
        locationID: Number(selectedLocation),
      });
      checkActiveSession();
    } catch (error) {
      console.error("Failed to start session:", error);
    }
  };

  const handleEndSession = async () => {
    try {
      await API.patch(`/submissions/${activeSession.id}`, {
        exitTime: new Date().toISOString(),
      });
      setActiveSession(null);
    } catch (error) {
      console.error("Failed to end session:", error);
    }
  };

  return (
    <div className="home-screen-container">
      {/* New Submission Panel */}
      {hasRole("user") && (
        <div className="home-screen-pane">
          <h3>New Submission Panel</h3>
          {!activeSession ? (
            <>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option value="">Select Location</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
              <button onClick={handleStartSession}>Start Session</button>
            </>
          ) : (
            <>
              <p>
                Active session at: <strong>{activeSession.location.name}</strong>
              </p>
              <p>Started: {new Date(activeSession.entryTime).toLocaleString()}</p>
              <button onClick={handleEndSession}>End Session</button>
            </>
          )}
        </div>
      )}

      {/* Placeholder panels */}
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
