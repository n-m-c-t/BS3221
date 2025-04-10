import "./home.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../axiosInstance";
import { useAuth } from "../../contexts/AuthContext";

export function Home() {
  const { user, hasRole } = useAuth();
  const [locations, setLocations] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [activeSession, setActiveSession] = useState(null);
  const [activeSessions, setActiveSessions] = useState([]);

  const userID = user?.id || 0;
  const navigate = useNavigate();

  useEffect(() => {
    fetchLocations();
    fetchUsers();
    checkActiveSession();
    fetchActiveSessions();

    const interval = setInterval(() => {
      fetchActiveSessions();
    }, 10000); // Poll every 10s

    return () => clearInterval(interval);
  }, []);

  const fetchLocations = async () => {
    try {
      const res = await API.get("/locations");
      setLocations(res.data);
    } catch (error) {
      console.error("Failed to fetch locations:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
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

  const fetchActiveSessions = async () => {
    try {
      const res = await API.get("/submissions");
      const sessions = res.data.filter((s) => !s.exitTime);
      setActiveSessions(sessions);
    } catch (error) {
      console.error("Failed to fetch active sessions:", error);
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
      fetchActiveSessions();
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
      fetchActiveSessions();
    } catch (error) {
      console.error("Failed to end session:", error);
    }
  };

  // Derived Data for Active Locations
  const activeLocationIDs = new Set(
    activeSessions.map((s) => s.location?.id).filter((id) => id !== undefined)
  );

  // Check if a location is covered (based on whether its ID is in activeLocationIDs)
  const locationsWithCoverage = locations.map((loc) => ({
    name: loc.name,
    isCovered: activeLocationIDs.has(loc.id),
  }));

  const totalLocationCount = locations.length;
  const activeLocationCount = locationsWithCoverage.filter(
    (loc) => loc.isCovered
  ).length;

  const totalWardenCount = users.filter((u) => u.role?.description === "user").length;
  const activeUsersSet = new Set(activeSessions.map((s) => s.userID));
  const activeUsersCount = activeUsersSet.size;

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

      {/* Placeholder Panel 2 */}
      <div className="home-screen-pane">
        <h3>HOME SCREEN PANE 2</h3>
      </div>

      {/* Panel 3 - Overview */}
      <div className="home-screen-pane">
        <h3>Active Session Overview</h3>

        <p>
          <strong>Locations Covered:</strong> {activeLocationCount}/{totalLocationCount}
        </p>

        <p><strong>Location Coverage:</strong></p>
        <ul>
          {locationsWithCoverage.map((loc, index) => (
            <li key={index}>
              {loc.name} - {loc.isCovered ? "✅" : "❌"}
            </li>
          ))}
        </ul>

        <p>
          <strong>Fire Wardens with active sessions:</strong> {activeUsersCount}/{totalWardenCount}
        </p>
      </div>
    </div>
  );
}

export default Home;
