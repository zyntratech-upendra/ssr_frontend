// src/pages/AdminManageUsers.jsx
import { useState, useEffect, useCallback } from "react";
import {
  Users,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  ClipboardList,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import { getAllUsers, toggleTeacherPermission } from "../services/authService";

const AdminManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    students: 0,
    teachers: 0,
    admins: 0,
    principals: 0,
  });
  const [filters, setFilters] = useState({
    role: "",
    department: "",
    search: "",
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  const fetchUsers = useCallback(async (filterParams = null) => {
    try {
      const queryFilters = { ...filters };
      if (filterParams) {
        Object.assign(queryFilters, filterParams);
      }

      const response = await getAllUsers(queryFilters);
      if (response.success) {
        setUsers(response.users);
        setStats(response.stats);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setMessage({ type: "error", text: "Failed to fetch users" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
  }, [filters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handleTogglePermission = async (userId) => {
    try {
      const response = await toggleTeacherPermission(userId);
      if (response.success) {
        setMessage({ type: "success", text: response.message });
        fetchUsers();
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Failed to update permission",
      });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
  };

  const clearFilters = () => {
    setFilters({
      role: "",
      department: "",
      search: "",
    });
  };

  return (
    <>
      <style>{`
        :root {
          --primary: #ad8ff8;
          --primary-dark: #8b6fe6;
          --soft: #f5f1ff;
          --text: #1e293b;
          --muted: #64748b;
          --success: #10b981;
          --danger: #ef4444;
        }

        body {
          background: linear-gradient(135deg,#f7f4ff,#eef2ff);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .admin-layout {
          display: flex;
          min-height: 100vh;
          overflow: hidden;
        }

        .main-content {
          flex: 1;
          padding: clamp(14px, 2vw, 32px);
          transition: margin-left .35s ease;
          overflow-y: auto;
        }

        .page-title {
          font-size: clamp(20px, 2.5vw, 28px);
          font-weight: 700;
          color: var(--primary-dark);
          margin-bottom: 4px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .page-subtitle {
          color: var(--muted);
          font-size: 14px;
        }

        .header-flex {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 24px;
        }

        .card-ui {
          background: #fff;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 10px 28px rgba(0,0,0,.08);
          margin-bottom: 24px;
          border: 1px solid rgba(0,0,0,0.05);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .stat-card {
          background: linear-gradient(135deg, rgba(173,143,248,0.1), rgba(139,111,230,0.05));
          border: 1px solid rgba(173,143,248,0.2);
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 15px 35px rgba(139,111,230,0.15);
        }

        .stat-value {
          font-size: 28px;
          font-weight: 700;
          color: var(--primary-dark);
          margin-bottom: 4px;
        }

        .stat-label {
          color: var(--muted);
          font-size: 13px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .message {
          padding: 16px 20px;
          border-radius: 12px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 500;
        }

        .message.success {
          background: rgba(16,185,129,0.1);
          color: var(--success);
          border: 1px solid rgba(16,185,129,0.2);
        }

        .message.error {
          background: rgba(239,68,68,0.1);
          color: var(--danger);
          border: 1px solid rgba(239,68,68,0.2);
        }

        .section-title {
          color: var(--text);
          font-weight: 600;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 20px;
        }

        .filters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
        }

        .form-label-strong {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          font-size: 14px;
          color: var(--text);
        }

        .form-input, .form-select {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          font-size: 15px;
          transition: all 0.3s ease;
          background: #fff;
          font-family: inherit;
        }

        .form-input:focus, .form-select:focus {
          outline: none;
          border-color: var(--primary-dark);
          box-shadow: 0 0 0 3px rgba(139,111,230,0.1);
        }

        .btn-secondary {
          background: #6c757d;
          color: #fff;
          border: none;
          border-radius: 12px;
          padding: 16px 24px;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-secondary:hover {
          background: #5a6268;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(108,117,125,0.3);
        }

        .users-table-container {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 8px 25px rgba(0,0,0,0.06);
          overflow: hidden;
        }

        .users-table {
          width: 100%;
          border-collapse: collapse;
        }

        .users-table thead th {
          position: sticky;
          top: 0;
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          color: #fff;
          padding: 16px 12px;
          font-weight: 600;
          font-size: 14px;
          white-space: nowrap;
          z-index: 10;
        }

        .users-table tbody td {
          padding: 16px 12px;
          border-bottom: 1px solid #f1f5f9;
          vertical-align: middle;
        }

        .users-table tbody tr:hover {
          background: #fdf2ff;
        }

        .role-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          color: #fff;
        }

        .role-badge.student { background: #10b981; }
        .role-badge.teacher { background: var(--primary-dark); }
        .role-badge.admin { background: #ef4444; }
        .role-badge.principal { background: #f59e0b; }

        .btn-sm {
          font-size: 13px;
          padding: 8px 16px;
          border-radius: 8px;
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .btn-success {
          background: #10b981;
          color: #fff;
        }

        .btn-success:hover {
          background: #059669;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(16,185,129,0.3);
        }

        .btn-secondary-sm {
          background: #6c757d;
          color: #fff;
        }

        .btn-secondary-sm:hover {
          background: #5a6268;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(108,117,125,0.3);
        }

        .table-wrapper {
          max-height: 600px;
          overflow: auto;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: var(--muted);
        }

        @media (max-width: 992px) {
          .main-content { margin-left: 80px !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .filters-grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 768px) {
          .main-content { 
            padding: 20px 16px; 
            margin-left: 0 !important;
          }
          .header-flex { 
            justify-content: center; 
            text-align: center; 
            flex-direction: column;
          }
          .stats-grid, .filters-grid { 
            grid-template-columns: 1fr; 
            gap: 16px;
          }
          .card-ui { padding: 20px 16px; }
          .users-table thead { display: none; }
          .users-table tbody tr { 
            display: block; 
            margin-bottom: 16px; 
            padding: 16px;
            border-radius: 12px;
            background: #fafafa;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          }
          .users-table tbody td { 
            display: block; 
            padding: 8px 0;
            border: none;
            position: relative;
            padding-left: 40%;
          }
          .users-table tbody td:before {
            content: attr(data-label);
            position: absolute;
            left: 12px;
            font-weight: 600;
            color: #1e293b;
            width: 35%;
          }
          .btn-sm { width: 100%; justify-content: center; margin-top: 8px; }
        }

        @media (max-width: 480px) {
          .stats-grid { gap: 12px; }
          .card-ui { padding: 16px 12px; }
        }
      `}</style>

      <div className="admin-layout">
        <Sidebar onToggle={setSidebarOpen} />

        <main
          className="main-content"
          style={{
            marginLeft: sidebarOpen ? "250px" : "80px",
          }}
        >
          {/* HEADER */}
          <div className="header-flex">
            <div>
              <h1 className="page-title">
                <Users size={24} />
                Manage Users
              </h1>
              <small className="page-subtitle">
                View and manage all system users with advanced filtering
              </small>
            </div>
          </div>

          {/* STATS */}
          <section className="card-ui">
            <h3 className="section-title">User Statistics</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{stats.total}</div>
                <div className="stat-label">Total Users</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.students}</div>
                <div className="stat-label">Students</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.teachers}</div>
                <div className="stat-label">Teachers</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.admins + stats.principals}</div>
                <div className="stat-label">Administrators</div>
              </div>
            </div>
          </section>

          {/* MESSAGE */}
          {message.text && (
            <div className="card-ui">
              <div className={`message ${message.type}`}>
                {message.type === "success" ? <CheckCircle size={20} /> : <XCircle size={20} />}
                <span>{message.text}</span>
              </div>
            </div>
          )}

          {/* FILTERS */}
          <section className="card-ui">
            <h3 className="section-title">
              <Filter size={20} />
              Filters
            </h3>
            <div className="filters-grid">
              <div className="filter-group">
                <label className="form-label-strong">
                  <Search size={16} />
                  Search Users
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search by name or email"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                />
              </div>

              <div className="filter-group">
                <label className="form-label-strong">Role</label>
                <select
                  className="form-select form-input"
                  name="role"
                  value={filters.role}
                  onChange={handleFilterChange}
                >
                  <option value="">All Roles</option>
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                  <option value="principal">Principal</option>
                </select>
              </div>

              <div className="filter-group">
                <label className="form-label-strong">Department</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Filter by department"
                  name="department"
                  value={filters.department}
                  onChange={handleFilterChange}
                />
              </div>

              <div className="filter-group">
                <button className="btn-secondary" onClick={clearFilters}>
                  Clear All Filters
                </button>
              </div>
            </div>
          </section>

          {/* USERS TABLE */}
          {users.length > 0 ? (
            <section className="card-ui">
              <h3 className="section-title">
                <ClipboardList size={20} />
                User List ({users.length})
              </h3>
              <div className="users-table-container">
                <div className="table-wrapper">
                  <table className="users-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Department</th>
                        <th>ID</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user._id}>
                          <td data-label="Name">{user.name}</td>
                          <td data-label="Email">{user.email}</td>
                          <td data-label="Role">
                            <span className={`role-badge ${user.role}`}>
                              {user.role}
                            </span>
                          </td>
                          <td data-label="Department">{user.department || "-"}</td>
                          <td data-label="ID">{user.enrollmentId || user.employeeId || "-"}</td>
                          <td data-label="Created">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td data-label="Actions">
                            {user.role === "teacher" && (
                              <button
                                className={`btn-sm ${
                                  user.canRegisterStudents ? "btn-success" : "btn-secondary-sm"
                                }`}
                                onClick={() => handleTogglePermission(user._id)}
                              >
                                {user.canRegisterStudents ? (
                                  <>
                                    <CheckCircle size={14} />
                                    Can Register
                                  </>
                                ) : (
                                  <>
                                    <XCircle size={14} />
                                    No Permission
                                  </>
                                )}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          ) : (
            <section className="card-ui empty-state">
              <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}>
                👥
              </div>
              No users found matching your filters
            </section>
          )}
        </main>
      </div>
    </>
  );
};

export default AdminManageUsers;
