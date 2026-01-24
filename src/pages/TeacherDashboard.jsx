import Layout from "../components/Layout";
import Card from "../components/Card";
import { BookOpen, Users, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { getTeacherDashboardStats } from "../services/teacherDashboardService";

const TeacherDashboard = () => {
  const [stats, setStats] = useState({
    myClasses: 0,
    totalStudents: 0,
    pendingGrades: 0,
    todayClasses: 0,
    courses: [],
    allocations: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Get user from localStorage
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const teacherId = user._id || user.id;

        if (teacherId) {
          const dashboardStats = await getTeacherDashboardStats(teacherId);
          setStats(dashboardStats);
        }
      } catch (error) {
        console.error("Error loading teacher dashboard data:", error);
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
          min-width: 760px;
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
        <h1 className="section-title">Teacher Dashboard</h1>

        {/* KPI CARDS */}
        <div className="dashboard-grid">
          <Card
            title="My Classes"
            value={loading ? "Loading..." : stats.myClasses}
            description="Active classes this semester"
            icon={BookOpen}
          />
          <Card
            title="Total Students"
            value={loading ? "Loading..." : stats.totalStudents}
            description="Students across all classes"
            icon={Users}
          />
          <Card
            title="Today's Classes"
            value={loading ? "Loading..." : stats.todayClasses}
            description="Scheduled for today"
            icon={Calendar}
          />
        </div>

        {/* CLASSES TABLE */}
        <h2 className="section-title">My Classes</h2>

        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>Course Code</th>
                <th>Course Name</th>
                <th>Students</th>
                <th>Department</th>
                <th>Status</th>
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
                stats.courses.map((course, index) => {
                  // Count students for this course from allocations
                  const courseAllocations = stats.allocations.filter(
                    a => a.course?._id === course._id || a.course === course._id
                  );
                  const studentCount = courseAllocations.length > 0 
                    ? courseAllocations.reduce((sum, a) => sum + (a.students?.length || 35), 0)
                    : 0;

                  return (
                    <tr key={course._id || index}>
                      <td>{course.courseCode || "N/A"}</td>
                      <td>{course.courseName || course.name || "N/A"}</td>
                      <td>{studentCount}</td>
                      <td>{course.department?.departmentName || course.department || "N/A"}</td>
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
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                    No courses assigned
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

export default TeacherDashboard;
