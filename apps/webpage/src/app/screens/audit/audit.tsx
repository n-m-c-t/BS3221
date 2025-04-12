import React, { useEffect, useState } from "react";
import API from "../../axiosInstance";
import "../audit/audit.css";

interface Submission {
  id: number;
  entryTime: string;
  exitTime: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
  };
  location: {
    id: number;
    name: string;
  };
}

interface Location {
  id: number;
  name: string;
}

export function Audit() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const [showModal, setShowModal] = useState(false);
  const [currentSubmissionId, setCurrentSubmissionId] = useState<number | null>(null);
  const [locationID, setLocationID] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');

  const [currentPage, setCurrentPage] = useState(1);
  const submissionsPerPage = 10;

  useEffect(() => {
    fetchAllSubmissions();
    fetchLocations();
  }, []);

  const fetchAllSubmissions = async () => {
    try {
      const response = await API.get("/submissions");
      setSubmissions(response.data);
      setFilteredSubmissions(response.data);
    } catch (error) {
      console.error("Error fetching all submissions:", error);
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

  const handleFilter = () => {
    let results = [...submissions];

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      results = results.filter((sub) =>
        sub.user.firstName.toLowerCase().includes(lowerSearch) ||
        sub.user.lastName.toLowerCase().includes(lowerSearch)
      );
    }

    if (selectedLocation) {
      results = results.filter(
        (sub) => sub.location.name === selectedLocation
      );
    }

    if (startDate) {
      const start = new Date(startDate);
      results = results.filter((sub) => new Date(sub.entryTime) >= start);
    }

    if (endDate) {
      const end = new Date(endDate);
      results = results.filter((sub) => new Date(sub.entryTime) <= end);
    }

    setFilteredSubmissions(results);
    setCurrentPage(1);
  };

  const handleEdit = (submission: Submission) => {
    setCurrentSubmissionId(submission.id);
    setLocationID(submission.location.id);

    const entry = new Date(submission.entryTime);
    const entryLocal = entry.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).slice(0, 5);

    const exitLocal = submission.exitTime
      ? new Date(submission.exitTime).toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }).slice(0, 5)
      : "";

    setStartTime(entryLocal);
    setEndTime(exitLocal);
    setShowModal(true);
  };

  const handleSaveSubmission = async () => {
    if (!locationID || !startTime) return;

    const today = new Date().toISOString().split("T")[0];
    const entryISO = new Date(`${today}T${startTime}:00`).toISOString();
    const exitISO = endTime ? new Date(`${today}T${endTime}:00`).toISOString() : null;

    try {
      await API.patch(`/submissions/${currentSubmissionId}`, {
        locationID,
        entryTime: entryISO,
        exitTime: exitISO
      });
      fetchAllSubmissions();
      setShowModal(false);
    } catch (err) {
      console.error("Failed to save submission", err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await API.delete(`/submissions/${id}`);
      fetchAllSubmissions();
    } catch (err) {
      console.error("Failed to delete submission", err);
    }
  };

  const indexOfLastSubmission = currentPage * submissionsPerPage;
  const indexOfFirstSubmission = indexOfLastSubmission - submissionsPerPage;
  const currentSubmissions = filteredSubmissions.slice(indexOfFirstSubmission, indexOfLastSubmission);

  const totalPages = Math.ceil(filteredSubmissions.length / submissionsPerPage);

  return (
    <div className="submission-screen-container">
      <h3>Audit Submissions</h3>

      <div className="filters" style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Search by user name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
        >
          <option value="">All Locations</option>
          {locations.map((loc) => (
            <option key={loc.id} value={loc.name}>
              {loc.name}
            </option>
          ))}
        </select>

        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        <button className="create-btn" onClick={handleFilter}>Apply Filters</button>
      </div>

      <div className="submission-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
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
                <td>{submission.user.firstName} {submission.user.lastName}</td>
                <td>{submission.location.name}</td>
                <td>{new Date(submission.entryTime).toLocaleString()}</td>
                <td>{submission.exitTime ? new Date(submission.exitTime).toLocaleString() : "On-going session"}</td>
                <td>
                  <button className="action-btn edit" onClick={() => handleEdit(submission)}>Edit</button>
                  <button className="action-btn delete" onClick={() => handleDelete(submission.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination-controls">
          <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
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
            >
              <option value="">Select Location</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>{loc.name}</option>
              ))}
            </select>

            <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
            <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />

            <div className="modal-actions">
              <button className="cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="submit" onClick={handleSaveSubmission}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Audit;
