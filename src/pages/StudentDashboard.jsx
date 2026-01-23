import Layout from "../components/Layout";
import Card from "../components/Card";
import { BookOpen, Calendar, FileText, Award } from "lucide-react";

const StudentDashboard = () => {
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
            title="Enrolled Courses"
            value="6"
            description="Active courses this semester"
            icon={BookOpen}
          />
          <Card
            title="Attendance"
            value="92%"
            description="Overall attendance rate"
            icon={Calendar}
          />
          <Card
            title="Assignments"
            value="4"
            description="Pending submissions"
            icon={FileText}
          />
          <Card
            title="GPA"
            value="3.8"
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
                <th>Credits</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>CS101</td>
                <td>Introduction to Programming</td>
                <td>Dr. John Smith</td>
                <td>3</td>
                <td>A</td>
              </tr>
              <tr>
                <td>MATH201</td>
                <td>Calculus II</td>
                <td>Dr. Sarah Johnson</td>
                <td>4</td>
                <td>A-</td>
              </tr>
              <tr>
                <td>ENG101</td>
                <td>English Composition</td>
                <td>Prof. Michael Brown</td>
                <td>3</td>
                <td>B+</td>
              </tr>
              <tr>
                <td>PHY101</td>
                <td>Physics I</td>
                <td>Dr. Emily Davis</td>
                <td>4</td>
                <td>A</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Layout>
    </>
  );
};

export default StudentDashboard;
