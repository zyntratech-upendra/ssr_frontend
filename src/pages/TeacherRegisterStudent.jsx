import React, { useState, useEffect } from "react";
import { UserPlus, CheckCircle, AlertCircle, Lock, Loader2 } from "lucide-react";
import { teacherRegisterStudent, getMyStudents } from "../services/authService";
import { fetchBatchesByDepartment, fetchSectionsByDepartment } from "../services/teacherAllocationService.jsx";
import { getAllDepartments } from "../services/departmentService";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import Card from "../components/Card";
import "bootstrap/dist/css/bootstrap.min.css";

const UPLOADED_FILE_URL = "/mnt/data/user-uploaded-file";

const TeacherRegisterStudent = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    batch: "",
    section: "",
    phone: "",
    enrollmentId: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [myStudents, setMyStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [batches, setBatches] = useState([]);
  const [sections, setSections] = useState([]);
  const [hasPermission, setHasPermission] = useState(false);
  const [fetchingStudents, setFetchingStudents] = useState(false);
  const [loadingMainContent, setLoadingMainContent] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && user.canRegisterStudents) {
      setHasPermission(true);
      fetchInitialData();
    } else {
      setHasPermission(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchInitialData = async () => {
    await fetchDepartments();
    fetchMyStudents();
    // stop skeleton after 1 sec
    setTimeout(() => {
      setLoadingMainContent(false);
    }, 1000);
  };

  const fetchDepartments = async () => {
    try {
      const response = await getAllDepartments();
      if (response?.success) setDepartments(response.data || []);
      else if (Array.isArray(response)) setDepartments(response);
    } catch (err) {
      console.error("Error fetching departments:", err);
      setDepartments([]);
    }
  };

  const fetchBatches = async (departmentId) => {
    try {
      const response = await fetchBatchesByDepartment(departmentId);
      if (response?.success) {
        setBatches(response.data || []);
      } else {
        setBatches([]);
        setError(response?.message || "Failed to fetch batches.");
      }
    } catch (err) {
      console.error("Error fetching batches:", err);
      setBatches([]);
      setError("Failed to fetch batches. Please try again.");
    }
  };

  const fetchSections = async (departmentId) => {
    try {
      const response = await fetchSectionsByDepartment(departmentId);
      if (response && response.success) {
        setSections(response.data || []);
      } else if (Array.isArray(response)) {
        setSections(response);
      } else {
        setSections([]);
      }
    } catch (err) {
      console.error("Failed to fetch sections:", err);
      setSections([]);
    }
  };

  const handleDepartmentChange = (e) => {
    const departmentId = e.target.value;
    setFormData({
      ...formData,
      department: departmentId,
      batch: "",
      section: "",
    });
    setBatches([]);
    setSections([]);
    if (departmentId) {
      fetchBatches(departmentId);
      fetchSections(departmentId);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setMessage({ type: "", text: "" });
  };

  const fetchMyStudents = async () => {
    setFetchingStudents(true);
    try {
      const response = await getMyStudents();
      if (response?.success) setMyStudents(response.students || []);
      else setMyStudents([]);
    } catch (err) {
      console.error("Error fetching students:", err);
      setMyStudents([]);
    } finally {
      setFetchingStudents(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    const { name, email, password, section, department, batch } = formData;

    if (!name || !email || !password || !department || !batch || !section) {
      setMessage({ type: "error", text: "Please fill in all required fields." });
      return;
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      setMessage({ type: "error", text: "Please enter a valid email address." });
      return;
    }

    if (password.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters." });
      return;
    }

    setLoading(true);
    try {
      const response = await teacherRegisterStudent(formData);
      if (response?.success) {
        setMessage({ type: "success", text: "Student registered successfully!" });
        setFormData({
          name: "",
          email: "",
          password: "",
          department: "",
          batch: "",
          section: "",
          phone: "",
          enrollmentId: "",
        });
        fetchMyStudents();
      } else {
        setMessage({ type: "error", text: response?.message || "Failed to register student." });
      }
    } catch (err) {
      console.error("Register error:", err);
      setMessage({ type: "error", text: err?.message || "Something went wrong." });
    } finally {
      setLoading(false);
    }
  };

  if (!hasPermission) {
    return (
      <div className="page-without-sidebar">
        <div className="auth-area container py-5">
          <div className="d-flex justify-content-center mb-4">
            <Lock size={36} />
          </div>
          <Card>
            <div className="text-center p-4">
              <AlertCircle size={64} className="mb-3 text-danger" />
              <h3>Permission Required</h3>
              <p className="mb-0">You do not have permission to register students. Contact your administrator.</p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        :root{
          --bg: #f6f7fb;
          --card: #fff;
          --muted: #6c757d;
          --primary: #5b2c6f;
          --accent: #8e44ad;
          --radius: 12px;
          --shadow: rgba(27,31,40,0.06);
        }
        .page {
          display:flex;
          min-height:100vh;
          background: var(--bg);
        }
        .main {
          flex:1;
          padding: 28px;
          transition: margin-left .28s ease;
          min-height:100vh;
          position: relative;
          overflow-y: auto;
          min-width: 0; /* Fix flex overflow */
          background: var(--bg);
        }
        .container-card {
          background: var(--card);
          border-radius: var(--radius);
          padding: 18px;
          box-shadow: 0 8px 24px var(--shadow);
          margin-bottom: 18px;
        }
        .page-header {
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:12px;
          margin-bottom: 14px;
          flex-wrap: wrap;
        }
        .page-title {
          margin:0;
          font-weight:700;
          color: var(--primary);
          display:flex;
          align-items:center;
          gap:10px;
          flex-wrap: wrap;
          font-size: 1.5rem;
        }
        .page-subtitle {
          margin:0;
          color: var(--muted);
          font-size: 0.9rem;
          flex: 1 1 100%;
        }
        .register-content {
          display:grid;
          grid-template-columns: 1fr 420px;
          gap: 18px;
          align-items:flex-start;
        }
        @media (max-width: 992px) {
          .register-content {
            grid-template-columns: 1fr;
          }
        }
        .register-form .form-section {
          margin-bottom: 12px;
        }
        .section-title {
          margin:0 0 12px 0;
          font-size:1.2rem;
          font-weight:700;
          color:#333;
        }
        .form-group {
          margin-bottom: 12px;
        }
        .form-input {
          width:100%;
          padding: 8px 10px;
          border-radius: 8px;
          border: 1px solid #dcd7e6;
          font-size: 0.95rem;
          box-sizing: border-box;
        }
        .required { color:#d9534f; margin-left: 4px; }
        .message {
          display:flex;
          align-items:center;
          gap:10px;
          padding:10px 12px;
          border-radius:8px;
          margin:12px 0;
          word-break: break-word;
        }
        .message.success { background:#e9f7ef; color:#1b5e20; border:1px solid #c8e6c9; }
        .message.error { background:#fff0f0; color:#7a1f1f; border:1px solid #f5c6cb; }
        .btn-primary.custom {
          background: linear-gradient(90deg,var(--primary),var(--accent));
          border: none;
          color: #fff;
        }
        .users-card {
          position:relative;
          max-width: 100%;
          overflow-x: auto;
        }
        .users-table {
          margin-top: 12px;
        }
        .users-table table {
          width:100%;
          border-collapse: collapse;
          min-width: 600px;
        }
        .users-table th, .users-table td {
          padding: 10px 8px;
          border-bottom: 1px solid #f1f1f1;
          text-align: left;
          font-size: 0.95rem;
          white-space: nowrap;
        }
        .users-table thead th {
          font-weight:700;
          background: linear-gradient(90deg,#f3e5f5,#f7ecf9);
        }
        .no-data {
          color: var(--muted);
          padding: 12px 0;
        }
        .small-muted { color: var(--muted); font-size: .9rem; }
        .btn-loading {
          display: inline-flex;
          gap:8px;
          align-items:center;
        }
        /* Skeleton style */
        .skeleton {
          background: linear-gradient(90deg,#ececec 25%, #f6f6f6 50%, #ececec 75%);
          background-size: 200% 100%;
          animation: shimmer 1.2s infinite linear;
          border-radius: 6px;
          user-select: none;
          pointer-events: none;
        }
        @keyframes shimmer {
          0% { background-position: -200% 0 }
          100% { background-position: 200% 0 }
        }
        /* Responsive tweaks */
        .form-row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        .form-row > div {
          flex: 1;
          min-width: 140px;
        }
        @media (max-width: 576px) {
          .page-header {
            flex-direction: column;
            align-items:flex-start;
            gap:6px;
          }
          .page-title {
            font-size: 1.3rem;
          }
          .users-table table {
            min-width: 100%;
          }
          .users-table th, .users-table td {
            white-space: normal;
            word-wrap: break-word;
          }
        }
      `}</style>

      <div className="page">
        <Sidebar onToggle={setSidebarOpen} />

        <main
          className="main"
          style={{ marginLeft: sidebarOpen ? "250px" : "80px" }}
          aria-busy={loadingMainContent || loading || fetchingStudents}
        >
          {(loadingMainContent) && (
            <div
              aria-label="Loading content"
              style={{
                position: "absolute",
                inset: 0,
                background: "var(--card)",
                borderRadius: "var(--radius)",
                boxShadow: "0 8px 24px var(--shadow)",
                padding: 28,
                display: "flex",
                flexDirection: "column",
                gap: 16,
                zIndex: 1000,
              }}
            >
              {/* Skeleton: page header */}
              <div className="skeleton" style={{ height: 30, width: "60%" }} />
              <div className="skeleton" style={{ height: 18, width: "35%" }} />
              {/* Skeleton: grid content */}
              <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
                {/* Form skeleton */}
                <div style={{ flex: "1 1 420px", minWidth: 280 }}>
                  <div className="skeleton" style={{ height: 32, width: 200, borderRadius: 8, marginBottom: 12 }} />
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="skeleton" style={{ height: 36, borderRadius: 8, marginBottom: 10 }} />
                  ))}
                  <div className="skeleton" style={{ height: 36, borderRadius: 8, marginTop: 10 }} />
                </div>
                {/* Students skeleton */}
                <aside style={{ flex: "0 0 420px", minWidth: 280 }}>
                  <div className="skeleton" style={{ height: 28, width: 180, marginBottom: 12, borderRadius: 8 }} />
                  <div>
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="skeleton"
                        style={{ height: 28, width: "100%", marginBottom: 8, borderRadius: 6 }}
                      />
                    ))}
                  </div>
                </aside>
              </div>
            </div>
          )}

          {/* Actual Content */}
          {!loadingMainContent && (
            <>
              <div className="page-header">
                <div>
                  <h1 className="page-title">
                    <UserPlus size={26} /> Register New Student
                  </h1>
                  <div className="small-muted page-subtitle">
                    Create and manage your assigned students
                  </div>
                </div>
                <div className="small-muted">
                  Uploaded file:
                  <code style={{ color: "#444", marginLeft: 6 }}>{UPLOADED_FILE_URL}</code>
                </div>
              </div>

              <div className="register-content">
                {/* Left: Form */}
                <div className="container-card register-form">
                  <form onSubmit={handleSubmit} noValidate>
                    <div className="form-section">
                      <h3 className="section-title">Student Information</h3>

                      <div className="form-group">
                        <label htmlFor="name">
                          Name <span className="required">*</span>
                        </label>
                        <input
                          id="name"
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="form-input"
                          placeholder="Enter full name"
                          aria-required="true"
                          aria-label="Student name"
                          disabled={loading}
                          autoComplete="name"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="email">
                          Email <span className="required">*</span>
                        </label>
                        <input
                          id="email"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="form-input"
                          placeholder="student@example.com"
                          aria-required="true"
                          aria-label="Student email"
                          disabled={loading}
                          autoComplete="email"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="password">
                          Password <span className="required">*</span>
                        </label>
                        <input
                          id="password"
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className="form-input"
                          placeholder="Min 6 characters"
                          aria-required="true"
                          aria-label="Password"
                          disabled={loading}
                          autoComplete="new-password"
                        />
                      </div>

                      <div className="form-row">
                        <div>
                          <label htmlFor="department">
                            Department <span className="required">*</span>
                          </label>
                          <select
                            id="department"
                            name="department"
                            className="form-input"
                            value={formData.department}
                            onChange={handleDepartmentChange}
                            aria-required="true"
                            aria-label="Select department"
                            disabled={loading}
                          >
                            <option value="">Select Department</option>
                            {departments.map((dep) => (
                              <option key={dep._id} value={dep._id}>
                                {dep.departmentName}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label htmlFor="batch">
                            Batch <span className="required">*</span>
                          </label>
                          <select
                            id="batch"
                            name="batch"
                            className="form-input"
                            value={formData.batch}
                            onChange={handleChange}
                            disabled={!formData.department || loading}
                            aria-required="true"
                            aria-label="Select batch"
                          >
                            <option value="">Select Batch</option>
                            {batches.map((batch) => (
                              <option key={batch._id} value={batch._id}>
                                {batch.batchName}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="form-group mt-2">
                        <label htmlFor="section">
                          Section <span className="required">*</span>
                        </label>
                        <select
                          id="section"
                          name="section"
                          className="form-input"
                          value={formData.section}
                          onChange={handleChange}
                          required
                          aria-required="true"
                          aria-label="Select section"
                          disabled={loading}
                        >
                          <option value="">
                            {sections && sections.length > 0
                              ? "Select Section"
                              : "Select department first"}
                          </option>
                          {sections && sections.length > 0
                            ? sections.map((sec) => (
                                <option
                                  key={sec._id || sec.sectionName}
                                  value={sec.sectionName || sec._id}
                                >
                                  {sec.sectionName || sec.section}
                                </option>
                              ))
                            : null}
                        </select>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="phone">Phone</label>
                          <input
                            id="phone"
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Optional"
                            aria-label="Phone"
                            disabled={loading}
                            autoComplete="tel"
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="enrollmentId">Enrollment ID</label>
                          <input
                            id="enrollmentId"
                            type="text"
                            name="enrollmentId"
                            value={formData.enrollmentId}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Optional"
                            aria-label="Enrollment ID"
                            disabled={loading}
                            autoComplete="off"
                          />
                        </div>
                      </div>
                    </div>

                    {message.text && (
                      <div className={`message ${message.type}`} role="alert" aria-live="polite">
                        {message.type === "success" ? (
                          <CheckCircle size={18} aria-hidden="true" />
                        ) : (
                          <AlertCircle size={18} aria-hidden="true" />
                        )}
                        <div>{message.text}</div>
                      </div>
                    )}

                    <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                      <button
                        type="submit"
                        className={`btn btn-primary btn-loading`}
                        disabled={loading}
                        style={{ borderRadius: 8 }}
                        aria-disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="animate-spin" size={16} aria-hidden="true" /> Registering...
                          </>
                        ) : (
                          "Register Student"
                        )}
                      </button>

                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() =>
                          setFormData({
                            name: "",
                            email: "",
                            password: "",
                            department: "",
                            batch: "",
                            section: "",
                            phone: "",
                            enrollmentId: "",
                          })
                        }
                        disabled={loading}
                        aria-disabled={loading}
                      >
                        Reset
                      </button>
                    </div>
                  </form>
                </div>

                {/* Right: My Students */}
                <aside className="container-card users-card" aria-live="polite" aria-busy={fetchingStudents}>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h4 style={{ margin: 0 }}>My Registered Students</h4>
                      <div className="small-muted">{myStudents.length} students</div>
                    </div>
                  </div>

                  <div className="users-table">
                    {fetchingStudents ? (
                      <div className="p-3">
                        <div className="small-muted">Loading students...</div>
                      </div>
                    ) : myStudents.length > 0 ? (
                      <div style={{ overflowX: "auto" }}>
                        <table className="table table-sm" role="table" aria-label="Registered students table">
                          <thead>
                            <tr>
                              <th scope="col">Name</th>
                              <th scope="col">Email</th>
                              <th scope="col">Enroll ID</th>
                              <th scope="col">Department</th>
                              <th scope="col">Batch</th>
                              <th scope="col">Created</th>
                            </tr>
                          </thead>
                          <tbody>
                            {myStudents.map((student) => (
                              <tr key={student._id}>
                                <td>{student.name}</td>
                                <td>{student.email}</td>
                                <td>{student.enrollmentId || "—"}</td>
                                <td>{student.department?.departmentName || "—"}</td>
                                <td>{student.batch?.batchName || "—"}</td>
                                <td>{student.createdAt ? new Date(student.createdAt).toLocaleDateString() : "—"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="no-data p-3">No students registered yet.</div>
                    )}
                  </div>
                </aside>
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
};

export default TeacherRegisterStudent;
