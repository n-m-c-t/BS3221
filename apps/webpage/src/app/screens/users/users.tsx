import "./users.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/logo.png";

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  active: boolean;
}

export function Users() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleDeactivate = async (userId: number) => {
    try {
      const response = await fetch(`http://localhost:3000/api/users/${userId}/deactivate`, {
        method: "PATCH",
      });
  
      if (!response.ok) {
        throw new Error("Failed to deactivate user");
      }
  
      // Update state to reflect the change
      setUsers(users.map(user => 
        user.id === userId ? { ...user, active: false } : user
      ));
    } catch (error) {
      console.error("Error deactivating user:", error);
    }
  };
  
  const handleDelete = async (userId: number) => {
    try {
      const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
  
      // Remove the user from state
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  useEffect(() => {

    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/users");

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        setUsers(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();

  }, []);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  // Filter users based on the search query
  const filteredUsers = users.filter((user) => {
    return (
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="flex h-screen">
      {/* Main Content */}
      <div className="flex-1 p-5">
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

  {/* User List */}
    <h2>Users List</h2>

    {/* Search Bar */}
    <div className="search-bar-container mb-4">
      <input
        type="text"
        placeholder="Search users..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-bar"
      />
    </div>

    {/* User Table */}
    <div className="overflow-x-auto">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.active ? "✅" : "❌"}</td>
              <td className="action-buttons">
                <button className="deactivate" onClick={() => handleDeactivate(user.id)}>Deactivate</button>
                <button className="delete" onClick={() => handleDelete(user.id)}>Delete</button>
                <button className="reset-password">Reset Password</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</div>
  );
}

export default Users;
