// src/pages/AdminCreateCourse.jsx
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";
import { PlusSquare } from "lucide-react";
import courseService from "../services/courseService";

export default function AdminCreateCourse() {
  const [form, setForm] = useState({ courseName: "", description: "" });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [courses, setCourses] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const list = await courseService.getAllCourses();
      setCourses(list || []);
    } catch (err) {
      console.error("Failed to load courses:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!form.courseName)
      return setMessage({ type: "error", text: "Course name is required" });

    setSubmitting(true);
    try {
      const res = await courseService.createCourse(form);
      if (res.success) {
        setMessage({ type: "success", text: "Course created successfully" });
        setForm({ courseName: "", description: "" });
        loadCourses();
      } else {
        setMessage({ type: "error", text: res.message || "Failed to create" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Server error" });
    } finally {
      setSubmitting(false);
    }
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
          font-family: 'Inter','Poppins',system-ui,sans-serif;
          background: linear-gradient(135deg,#f7f4ff,#eef2ff);
          color: var(--text-dark);
          overflow: hidden;
        }

        .dashboard-container {
          display: flex;
          height: 100vh;
        }

        .main-content {
          flex-grow: 1;
          padding: clamp(16px,3vw,36px);
          overflow-y: auto;
          transition: margin-left .36s cubic-bezier(.2,.9,.2,1);
        }

        .page-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 28px;
        }

        .page-title {
          display: flex;
          align-items: center;
          gap: 14px;
          font-size: clamp(22px,2.5vw,28px);
          font-weight: 700;
          color: var(--primary-dark);
        }

        .page-subtitle {
          color: var(--text-muted);
          margin-top: 6px;
        }

        .card-box {
          background: linear-gradient(135deg,#fff,var(--primary-soft));
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 10px 30px rgba(173,143,248,0.18);
          margin-bottom: 28px;
        }

        .section-title {
          font-size: 20px;
          font-weight: 700;
          color: var(--primary-dark);
          margin-bottom: 18px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 24px;
        }

        label {
          font-weight: 600;
          margin-bottom: 6px;
          display: block;
        }

        .input {
          width: 100%;
          padding: 12px;
          border-radius: 12px;
          border: 1px solid var(--border);
        }

        .input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(173,143,248,.35);
        }

        .btn-primary {
          background: linear-gradient(135deg,var(--primary-dark),var(--primary));
          border-radius: 12px;
          padding: 12px 22px;
          font-weight: 600;
          border: none;
          color: #fff;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(173,143,248,.45);
        }

        .btn-outline {
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 12px 22px;
          background: #fff;
          font-weight: 600;
        }

        .message {
          padding: 12px;
          border-radius: 12px;
          font-weight: 600;
          margin-top: 12px;
        }

        .message.success {
          background: #ecfdf5;
          color: #065f46;
        }

        .message.error {
          background: #fef2f2;
          color: #b91c1c;
        }

        .course-grid {
          display: grid;
          grid-template-columns: repeat(2,minmax(0,1fr));
          gap: 20px;
        }

        .course-card {
          background: #fff;
          border-radius: 14px;
          padding: 18px;
          box-shadow: 0 10px 28px rgba(0,0,0,.06);
        }

        .course-card h4 {
          font-weight: 700;
          color: var(--primary-dark);
          margin-bottom: 6px;
        }

        @media (max-width: 992px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
          .course-grid {
            grid-template-columns: 1fr;
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
          <div className="page-header">
            <div>
              <div className="page-title">
                <PlusSquare size={28} /> Course Management
              </div>
              <div className="page-subtitle">
                Create and manage academic courses
              </div>
            </div>
          </div>

          {/* CREATE COURSE */}
          <div className="card-box">
            <h2 className="section-title">Create Course</h2>

            <form onSubmit={handleSubmit} className="form-grid">
              <div>
                <label>Course Name *</label>
                <input
                  className="input"
                  name="courseName"
                  value={form.courseName}
                  onChange={handleChange}
                  placeholder="e.g. Bachelor of Computer Science"
                />

                <label className="mt-3">Description</label>
                <input
                  className="input"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Optional description"
                />

                {message.text && (
                  <div className={`message ${message.type}`}>
                    {message.text}
                  </div>
                )}

                <div className="mt-4 d-flex gap-3">
                  <button className="btn-primary" disabled={submitting}>
                    {submitting ? "Creating..." : "Create Course"}
                  </button>
                  <button
                    type="button"
                    className="btn-outline"
                    onClick={() => setForm({ courseName: "", description: "" })}
                  >
                    Reset
                  </button>
                </div>
              </div>

              <div>
                <div className="card-box">
                  <strong>Tips</strong>
                  <p className="mt-2" style={{ color: "var(--text-muted)" }}>
                    • Use consistent naming<br />
                    • Keep names short<br />
                    • Courses are shared across departments
                  </p>
                </div>
              </div>
            </form>
          </div>

          {/* COURSE LIST */}
          <div className="card-box">
            <h2 className="section-title">Existing Courses</h2>

            {loading ? (
              <p>Loading courses...</p>
            ) : courses.length ? (
              <div className="course-grid">
                {courses.map((c) => (
                  <div key={c._id} className="course-card">
                    <h4>{c.courseName}</h4>
                    <p style={{ color: "var(--text-muted)" }}>
                      {c.description || "No description"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No courses created yet.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
