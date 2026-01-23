import Layout from "../components/Layout";
import Card from "../components/Card";
import { BookOpen, Users, Calendar, FileText } from "lucide-react";

const TeacherDashboard = () => {
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
            value="5"
            description="Active classes this semester"
            icon={BookOpen}
          />
          <Card
            title="Total Students"
            value="150"
            description="Students across all classes"
            icon={Users}
          />
          <Card
            title="Pending Grades"
            value="12"
            description="Assignments to grade"
            icon={FileText}
          />
          <Card
            title="Today's Classes"
            value="3"
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
                <th>Schedule</th>
                <th>Room</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>CS101</td>
                <td>Introduction to Programming</td>
                <td>45</td>
                <td>Mon, Wed, Fri 10:00 AM</td>
                <td>Room 201</td>
              </tr>
              <tr>
                <td>CS201</td>
                <td>Data Structures</td>
                <td>38</td>
                <td>Tue, Thu 2:00 PM</td>
                <td>Room 305</td>
              </tr>
              <tr>
                <td>CS301</td>
                <td>Database Systems</td>
                <td>32</td>
                <td>Mon, Wed 3:00 PM</td>
                <td>Lab 102</td>
              </tr>
              <tr>
                <td>CS401</td>
                <td>Software Engineering</td>
                <td>25</td>
                <td>Tue, Thu 10:00 AM</td>
                <td>Room 401</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Layout>
    </>
  );
};

export default TeacherDashboard;
