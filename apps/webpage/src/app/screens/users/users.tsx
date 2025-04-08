import "./users.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from '../../axiosInstance';

interface Role {
  id: number;
  description: string;
}

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  active: boolean;
}

export function Users() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showPasswordResetModal, setShowPasswordResetModal] = useState(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(7);
  
  const [newUser, setNewUser] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    roleID: 0,
    active: true
  });

  const fetchUsers = async () => {
    try {
      const response = await API.get("/users");
      if (response?.status !== 200) throw new Error("Failed to fetch users");
      setUsers(response.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleActivation = async (userId: number, currentlyActive: boolean) => {
    try {
      const endpoint = currentlyActive ? `/users/${userId}/deactivate` : `/users/${userId}/activate`;
      const response = await API.patch(endpoint);
  
      if (response?.status !== 200) throw new Error("Failed to update user status");
  
      setUsers(users.map(user =>
        user.id === userId ? { ...user, active: !currentlyActive } : user
      ));
    } catch (error) {
      console.error("Error updating user status:", error);
      setError("Error updating user status.");
    }
  };
  
  const handleDelete = async (userId: number) => {
    try {
      const response = await API.delete(`/users/${userId}`);
      if (response?.status !== 200) throw new Error("Failed to delete user");

      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("Error deleting user.");
    }
  };

  const handlePasswordReset = async (userId: number) => {
    try {
      // INSERT Logic for sending a password reset email
      setShowPasswordResetModal(true);
    } catch (error) {
      console.error("Error sending password reset email:", error);
      setError("Error sending password reset email.");
    }
  };

  const handleCreateUser = async () => {
    try {
      const role = { id: newUser.roleID };
      const userToCreate = { ...newUser, role };
      
      const response = await API.post('/users', userToCreate);
      if (response.status === 201) {
        setShowCreateUserModal(false);
        console.log("User created:", userToCreate);
        setNewUser({
          email: '',
          firstName: '',
          lastName: '',
          password: '',
          roleID: 0,
          active: true,
        });
        fetchUsers();
        alert('User created successfully!');
      }
    } catch (error: any) {
      console.error("Error creating user:", error);
      setError(error.response?.data?.message || 'Error creating user.');
    }
  };
  

  // Filter users based on the search query
  const filteredUsers = users.filter((user) => {
    return (
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    
    <div className="user-container">
      {showPasswordResetModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Password Reset</h3>
            <p>A password reset email has been sent to the user.</p>
            <div className="modal-actions">
              <button className="modal-btn confirm" onClick={() => setShowPasswordResetModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {showCreateUserModal && (
        <div className="modal-overlay">
          <div className="modal create-user-modal">
            <h3>Create User</h3>
            <form onSubmit={(e) => { e.preventDefault(); handleCreateUser(); }}>
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="First Name"
                value={newUser.firstName}
                onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                value={newUser.lastName}
                onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                required
              />
              <select
                value={newUser.roleID}
                onChange={(e) => setNewUser({ ...newUser, roleID: parseInt( e.target.value ) })}
                required
              >
                <option value="">Select Role</option>
                <option value="1">Admin</option>
                <option value="2">User</option>
              </select>
              <label>
                Active
                <input
                  type="checkbox"
                  checked={newUser.active}
                  onChange={(e) => setNewUser({ ...newUser, active: e.target.checked })}
                />
              </label>

              <div className="modal-actions">
                <button className="modal-btn cancel" onClick={() => setShowCreateUserModal(false)}>Cancel</button>
                <button className="modal-btn confirm" type="submit">Create User</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <h2>Users List</h2>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="create-user" onClick={() => setShowCreateUserModal(true)}>Create User</button>
      </div>

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Admin</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.email}</td>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.role.id === 1 ? "✅" : "❌"}</td>
                <td>{user.active ? "✅" : "❌"}</td>
                <td className="action-buttons">
                  <button 
                    className={user.active ? "deactivate" : "activate"}
                    onClick={() => handleToggleActivation(user.id, user.active)}
                  >
                    {user.active ? "Deactivate" : "Activate"}
                  </button>
                  <button className="delete" onClick={() => handleDelete(user.id)}>Delete</button>
                  <button className="reset-password" onClick={() => handlePasswordReset(user.id)}>Reset Password</button>
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
            Page {currentPage} of {Math.ceil(filteredUsers.length / usersPerPage)}
          </span>
          <button 
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage + 1)} 
            disabled={currentPage === Math.ceil(filteredUsers.length / usersPerPage)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Users;
