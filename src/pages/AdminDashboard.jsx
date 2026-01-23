import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Users, BookOpen, Building, FileText } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigate = useNavigate();

  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to logout?")) return;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      <style>{`
        :root {
          --sidebar-width: 250px;
          --sidebar-collapsed: 80px;

          --primary: #ad8ff8;
          --primary-dark: #8b6fe6;
          --primary-soft: #f5f1ff;

          --text-dark: #1e293b;
          --text-muted: #64748b;
          --border: #e5e7eb;
        }

        body {
          margin: 0;
          height: 100vh;
          font-family: 'Inter', 'Poppins', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
          background: linear-gradient(135deg, #f7f4ff, #eef2ff);
          color: var(--text-dark);
          overflow: hidden;
        }

        .dashboard-container {
          display: flex;
          height: 100vh;
          width: 100%;
        }

        .main-content {
          flex-grow: 1;
          padding: clamp(16px, 3vw, 36px);
          transition: margin-left 0.36s cubic-bezier(.2,.9,.2,1);
          overflow-y: auto;
          height: 100vh;
        }

        /* Scrollbar */
        .main-content::-webkit-scrollbar {
          width: 8px;
        }

        .main-content::-webkit-scrollbar-thumb {
          background: var(--primary);
          border-radius: 8px;
        }

        .main-content::-webkit-scrollbar-thumb:hover {
          background: var(--primary-dark);
        }

        /* Header */
        .dashboard-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          margin-bottom: 28px;
          flex-wrap: wrap;
        }

        .page-title {
          font-size: clamp(20px, 2.5vw, 28px);
          font-weight: 700; /* ⬅ reduced from 800 */
          letter-spacing: -0.2px;
          color: var(--primary-dark);
        }

        .section-title {
          font-size: clamp(18px, 2vw, 22px);
          font-weight: 700;
          color: var(--primary-dark);
          margin-bottom: 1rem;
        }

        /* Cards */
        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .dashboard-card {
          background: linear-gradient(135deg, #ffffff, var(--primary-soft));
          border-radius: 16px;
          padding: 22px;
          text-align: center;
          box-shadow: 0 10px 30px rgba(173,143,248,0.18);
          transition: all 0.3s ease;
        }

        .dashboard-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 36px rgba(173,143,248,0.28);
        }

        .dashboard-card h5 {
          font-weight: 600;
          margin-bottom: 6px;
        }

        .card-icon {
          color: var(--primary-dark);
          margin-bottom: 10px;
        }

        /* Table */
        .data-table {
          background: #fff;
          border-radius: 16px;
          overflow-x: auto;
          box-shadow: 0 10px 28px rgba(0,0,0,0.05);
          margin-bottom: 24px;
        }

        .data-table table {
          width: 100%;
          min-width: 720px;
          border-collapse: collapse;
        }

        .data-table th {
          background: linear-gradient(
            135deg,
            var(--primary),
            var(--primary-dark)
          );
          color: #fff;
          padding: 14px;
          font-size: 14px;
          font-weight: 600;
          white-space: nowrap;
        }

        .data-table td {
          padding: 14px;
          font-size: 14px;
          border-bottom: 1px solid #f1effa;
          color: var(--text-dark);
          white-space: nowrap;
        }

        .data-table tr:hover td {
          background: var(--primary-soft);
        }

        /* Logout Button */
        .logout-btn {
          padding: 10px 18px;
          background: linear-gradient(
            135deg,
            var(--primary-dark),
            var(--primary)
          );
          color: #fff;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.25s ease;
        }

        .logout-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 24px rgba(173,143,248,0.4);
        }

        /* Mobile */
        @media (max-width: 768px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }

          .logout-btn {
            width: 100%;
          }
        }
      `}</style>

      <div className="dashboard-container">
        <Sidebar onToggle={setSidebarOpen} />

        <div
          className="main-content"
          style={{
            marginLeft: sidebarOpen
              ? "var(--sidebar-width)"
              : "var(--sidebar-collapsed)",
          }}
        >
          <div className="dashboard-header">
            <h1 className="page-title">Admin Dashboard</h1>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>

          <div className="dashboard-grid">
            <div className="dashboard-card">
              <Users className="card-icon" size={40} />
              <h5>Total Users</h5>
              <p style={{ color: "#666" }}>1,245 Active users</p>
            </div>

            <div className="dashboard-card">
              <Building className="card-icon" size={40} />
              <h5>Departments</h5>
              <p style={{ color: "#666" }}>12 Academic departments</p>
            </div>

            <div className="dashboard-card">
              <BookOpen className="card-icon" size={40} />
              <h5>Courses</h5>
              <p style={{ color: "#666" }}>85 Active courses</p>
            </div>

            <div className="dashboard-card">
              <FileText className="card-icon" size={40} />
              <h5>Reports</h5>
              <p style={{ color: "#666" }}>23 Pending reports</p>
            </div>
          </div>

          <h2 className="section-title">User Management Overview</h2>

          <div className="data-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>John Smith</td>
                  <td>john.smith@college.edu</td>
                  <td>Teacher</td>
                  <td>Computer Science</td>
                  <td>Active</td>
                </tr>
                <tr>
                  <td>Sarah Johnson</td>
                  <td>sarah.j@college.edu</td>
                  <td>Teacher</td>
                  <td>Mathematics</td>
                  <td>Active</td>
                </tr>
                <tr>
                  <td>Michael Brown</td>
                  <td>m.brown@college.edu</td>
                  <td>Student</td>
                  <td>Engineering</td>
                  <td>Active</td>
                </tr>
                <tr>
                  <td>Emily Davis</td>
                  <td>emily.d@college.edu</td>
                  <td>Teacher</td>
                  <td>Physics</td>
                  <td>Active</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
