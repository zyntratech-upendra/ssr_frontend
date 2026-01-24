import Layout from "../components/Layout";
import Card from "../components/Card";
import { Calendar, Award } from "lucide-react";
import { useEffect, useState } from "react";
import { getStudentDashboardStats } from "../services/studentDashboardService";

const StudentDashboard = () => {
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    attendance: 0,
    assignments: 0,
    gpa: 0,
    courses: [],
    studentProfile: {},
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Get user from localStorage
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const userId = user._id || user.id;

        if (userId) {
          const dashboardStats = await getStudentDashboardStats(userId);
          setStats(dashboardStats);
        }
      } catch (error) {
        console.error("Error loading student dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <>
      <style>{`
        :root {
          --primary: #ad8ff8;
          --primary-dark: #8b6fe6;
          --primary-soft: #f5f1ff;

          --text-dark: #1e293b;
          --text-muted: #64748b;
          --border: #e5e7eb;
        }

        body {
          font-family: 'Inter', 'Poppins', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .section-title {
          font-size: clamp(20px, 2.4vw, 26px);
          font-weight: 700;
          color: var(--primary-dark);
          margin-bottom: 18px;
        }

        /* DASHBOARD GRID */
        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }

        /* DATA TABLE */
        .data-table {
          background: #ffffff;
          border-radius: 16px;
          overflow-x: auto;
          box-shadow: 0 10px 28px rgba(0,0,0,0.05);
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
          color: #ffffff;
          padding: 14px;
          font-size: 14px;
          font-weight: 600;
          text-align: left;
          white-space: nowrap;
        }

        .data-table td {
          padding: 14px;
          font-size: 14px;
          color: var(--text-dark);
          border-bottom: 1px solid #f1effa;
          white-space: nowrap;
        }

        .data-table tr:hover td {
          background: var(--primary-soft);
        }

        /* MOBILE */
        @media (max-width: 768px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }

          .section-title {
            margin-top: 10px;
          }
        }
      `}</style>

      <Layout>
        {/* TITLE */}
        <h1 className="section-title">Student Dashboard</h1>

        {/* KPI CARDS */}
        <div className="dashboard-grid">
          <Card
            title="Attendance"
            value={loading ? "Loading..." : `${stats.attendance}%`}
            description="Overall attendance rate"
            icon={Calendar}
          />
          <Card
            title="GPA"
            value={loading ? "Loading..." : stats.gpa.toFixed(2)}
            description="Current semester GPA"
            icon={Award}
          />
        </div>

        {/* COURSES TABLE */}
        <h2 className="section-title">My Courses</h2>

        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>Course Code</th>
                <th>Course Name</th>
                <th>Instructor</th>
                <th>Status</th>
                <th>Department</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                    Loading courses...
                  </td>
                </tr>
              ) : stats.courses.length > 0 ? (
                stats.courses.map((course, index) => (
                  <tr key={course._id || index}>
                    <td>{course.courseCode || "N/A"}</td>
                    <td>{course.courseName || course.name || "N/A"}</td>
                    <td>{course.createdBy?.name || "TBA"}</td>
                    <td>
                      <span
                        style={{
                          padding: "4px 12px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: "600",
                          backgroundColor: course.isActive !== false ? "#d4edda" : "#f8d7da",
                          color: course.isActive !== false ? "#155724" : "#721c24",
                        }}
                      >
                        {course.isActive !== false ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>{course.department?.departmentName || "N/A"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                    No courses enrolled
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Layout>
    </>
  );
};

export default StudentDashboard;
