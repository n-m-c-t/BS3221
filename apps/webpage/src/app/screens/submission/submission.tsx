import "./submission.css";
import API from "../../axiosInstance";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

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
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [locationID, setLocationID] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [currentSubmissionId, setCurrentSubmissionId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [submissionsPerPage] = useState(10);

  const fetchSubmissions = async () => {
    try {
      // Fetch submissions for the current user
      const response = await API.get(`/submissions/user/${user?.id}`);
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
    // Convert the UTC entryTime to local time
    const entryTime = new Date(submission.entryTime);
    const entryLocalTime = entryTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).slice(0, 5); // Format the time to match the <input type="time"> format

    const exitTime = submission.exitTime
      ? new Date(submission.exitTime).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }).slice(0, 5)
      : '';
    setStartTime(entryLocalTime);
    setEndTime(exitTime);
    setShowModal(true);
  };

  const handleSaveSubmission = async () => {
    if (!user) {
      console.error("User not found.");
      return;
    }

    if (!locationID || !startTime) {
      console.error("Please fill in all the fields.");
      return;
    }

    if (currentSubmissionId === null) {
      console.error("No submission selected for editing.");
      return;
    }

    // Convert local time back to UTC for entryTime and exitTime
    const currentDate = new Date().toISOString().split('T')[0];
    const entryDateTime = new Date(`${currentDate}T${startTime}:00`).toISOString(); // Convert to UTC
    const exitDateTime = endTime ? new Date(`${currentDate}T${endTime}:00`).toISOString() : null;
  
    try {
      const response = await API.patch(`/submissions/${currentSubmissionId}`, {
        locationID,
        entryTime: entryDateTime,
        exitTime: exitDateTime,
      });

      if (response.status === 200) {
        setShowModal(false);
        setLocationID(null);
        setStartTime('');
        setEndTime('');
        setCurrentSubmissionId(null);
        fetchSubmissions();  // Fetch updated submissions after save
      }
    } catch (error) {
      console.error("Error saving submission:", error);
    }
  };

  // Pagination logic
  const indexOfLastSubmission = currentPage * submissionsPerPage;
  const indexOfFirstSubmission = indexOfLastSubmission - submissionsPerPage;
  const currentSubmissions = submissions.slice(indexOfFirstSubmission, indexOfLastSubmission);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    if (user) {
      fetchSubmissions();
      fetchLocations();
    }
  }, [user]);

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
            {currentSubmissions.map((submission) => (
              <tr key={submission.id}>
                <td>{submission.id}</td>
                <td>{submission.location.name}</td>
                <td>{new Date(submission.entryTime).toLocaleString()}</td>
                <td>
                  {submission.exitTime
                    ? new Date(submission.exitTime).toLocaleString()
                    : "On-going session"}
                </td>
                <td>
                  <button className="action-btn edit" onClick={() => handleEditSubmission(submission)}>
                    Edit
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
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="page-number">
            Page {currentPage} of {Math.ceil(submissions.length / submissionsPerPage)}
          </span>
          <button 
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage + 1)} 
            disabled={currentPage === Math.ceil(submissions.length / submissionsPerPage)}
          >
            Next
          </button>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h4>Edit Submission</h4>
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