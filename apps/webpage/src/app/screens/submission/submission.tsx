import "./submission.css";
import React, { useEffect, useState } from "react";
import API from "../../axiosInstance";
import { useAuth } from "../../contexts/AuthContext";

interface Submission {
  id: number;
  entryTime: string;
  exitTime: string;
  location: {
    id: number;
    name: string;
  };
}

interface Location {
  id: number;
  name: string;
}

export function Submission() {
  const { user } = useAuth(); // Access the user from AuthContext
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [locationID, setLocationID] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [currentSubmissionId, setCurrentSubmissionId] = useState<number | null>(null);

  const fetchSubmissions = async () => {
    try {
      const response = await API.get("/submissions");
      setSubmissions(response.data);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await API.get("/locations");
      setLocations(response.data);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const handleEditSubmission = (submission: Submission) => {
    setCurrentSubmissionId(submission.id);
    setLocationID(submission.location.id);
    const entryTime = new Date(submission.entryTime).toISOString().split('T')[1].slice(0, 5); // Extract only time
    const exitTime = submission.exitTime ? new Date(submission.exitTime).toISOString().split('T')[1].slice(0, 5) : ''; // Set exit time if available
    setStartTime(entryTime);
    setEndTime(exitTime);
    setShowModal(true);
  };

  const handleSaveSubmission = async () => {
    if (!user) {
      console.error("User not found.");
      return;
    }

    try {
      if (!locationID || !startTime) {
        console.error("Please fill in all the fields.");
        return;
      }

      // Get current date and time for entry
      const currentDate = new Date().toISOString().split('T')[0]; // Only get date
      const entryDateTime = `${currentDate}T${startTime}:00`;
      const exitDateTime = endTime ? `${currentDate}T${endTime}:00` : null;

      const response = await API.patch(`/submissions/${currentSubmissionId}`, {
        userId: user.id,  // Pass userId from AuthContext
        locationId: locationID,
        entryTime: entryDateTime,  // Use selected start time with current date
        exitTime: exitDateTime,    // Set exit time if provided
      });

      if (response.status === 200) {
        setShowModal(false);
        setLocationID(null);
        setStartTime('');
        setEndTime('');
        setCurrentSubmissionId(null);
        fetchSubmissions();  // Refresh the submission list after saving changes
      }
    } catch (error) {
      console.error("Error saving submission:", error);
    }
  };

  const handleEndSession = async (submissionId: number) => {
    const currentDateTime = new Date().toISOString();

    try {
      const response = await API.patch(`/submissions/${submissionId}`, {
        exitTime: currentDateTime,  // Set exitTime to current time
      });

      if (response.status === 200) {
        fetchSubmissions();  // Refresh submission list after ending session
      }
    } catch (error) {
      console.error("Error ending session:", error);
    }
  };

  useEffect(() => {
    fetchSubmissions();
    fetchLocations();
  }, []);

  return (
    <div className="submission-screen-container">
      <h3>My Submissions</h3>

      <div className="submission-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Location</th>
              <th>Entry Time</th>
              <th>Exit Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => (
              <tr key={submission.id}>
                <td>{submission.id}</td>
                <td>{submission.location.name}</td>
                <td>{new Date(submission.entryTime).toLocaleString()}</td>
                <td>{submission.exitTime ? new Date(submission.exitTime).toLocaleString() : "Not ended yet"}</td>
                <td>
                  <button onClick={() => handleEditSubmission(submission)}>Edit</button>
                  {submission.exitTime === submission.entryTime && (
                    <button onClick={() => handleEndSession(submission.id)}>End Session</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h4>{currentSubmissionId ? "Edit Submission" : "Edit Submission"}</h4>
            <select
              value={locationID || ""}
              onChange={(e) => setLocationID(Number(e.target.value))}
              required
            >
              <option value="">Select Location</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>

            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />

            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />

            <div className="modal-actions">
              <button className="cancel" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="submit" onClick={handleSaveSubmission}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Submission;
