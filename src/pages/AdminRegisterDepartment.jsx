import { useState, useEffect } from "react";
import { PlusSquare, CheckCircle, AlertCircle } from "lucide-react";
import { adminRegisterDepartement, getAllDepartments } from "../services/departmentService";
import courseService from "../services/courseService";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminRegisterDepartment = () => {
  const [formData, setFormData] = useState({
    course: "",
    departmentName: "",
    description: "",
    departmentImage: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    fetchDepartments();
    fetchCourses();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await getAllDepartments();
      if (res.success) setDepartments(res.data);
    } catch {
      setMessage({ type: "error", text: "Failed to fetch departments." });
    }
  };

  const fetchCourses = async () => {
    try {
      const list = await courseService.getAllCourses();
      setCourses(list || []);
    } catch {}
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setMessage({ type: "", text: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.course || !formData.departmentName || !formData.description || !formData.departmentImage) {
      setMessage({ type: "error", text: "Please fill in all required fields" });
      return;
    }

    setSubmitting(true);
    try {
      const res = await adminRegisterDepartement(formData);
      if (res.success) {
        setMessage({ type: "success", text: "Department registered successfully!" });
        setFormData({
          course: "",
          departmentName: "",
          description: "",
          departmentImage: "",
        });
        fetchDepartments();
      } else {
        setMessage({ type: "error", text: res.message || "Failed to register department." });
      }
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to register department." });
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
        .page-header {
          margin-bottom: 28px;
        }

        .page-title {
          font-size: clamp(22px, 2.5vw, 28px);
          font-weight: 700;
          letter-spacing: -0.2px;
          color: var(--primary-dark);
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .page-subtitle {
          color: var(--text-muted);
          margin-top: 6px;
        }

        /* Form Card */
        .form-card {
          background: linear-gradient(135deg, #ffffff, var(--primary-soft));
          border-radius: 16px;
          padding: 26px;
          box-shadow: 0 10px 30px rgba(173,143,248,0.18);
          margin-bottom: 32px;
        }

        .section-title {
          font-size: 20px;
          font-weight: 700;
          color: var(--primary-dark);
          margin-bottom: 18px;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-label {
          font-weight: 600;
          margin-bottom: 6px;
          display: block;
        }

        .form-input {
          width: 100%;
          padding: 12px 14px;
          border-radius: 12px;
          border: 1px solid var(--border);
          transition: .25s ease;
        }

        .form-input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(173,143,248,.35);
          outline: none;
        }

        .btn-primary {
          background: linear-gradient(135deg,var(--primary-dark),var(--primary));
          border: none;
          border-radius: 12px;
          padding: 12px 22px;
          font-weight: 600;
          transition: .3s ease;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(173,143,248,0.45);
        }

        /* Messages */
        .message {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px;
          border-radius: 12px;
          margin-bottom: 16px;
          font-weight: 600;
        }

        .message.success {
          background: #ecfdf5;
          color: #065f46;
        }

        .message.error {
          background: #fef2f2;
          color: #b91c1c;
        }

        /* Department Cards */
        .department-list {
          background: #fff;
          border-radius: 16px;
          padding: 26px;
          box-shadow: 0 10px 28px rgba(0,0,0,0.05);
        }

        .department-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 22px;
        }

        .department-item {
          background: linear-gradient(135deg,#ffffff,var(--primary-soft));
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(173,143,248,0.18);
          transition: all .3s ease;
          text-decoration: none;
        }

        .department-item:hover {
          transform: translateY(-6px);
          box-shadow: 0 18px 40px rgba(173,143,248,0.35);
        }

        .department-image {
          width: 100%;
          height: 170px;
          object-fit: cover;
        }

        .department-details {
          padding: 14px 16px;
        }

        .department-name {
          font-size: 16px;
          font-weight: 700;
          color: var(--primary-dark);
          margin-bottom: 6px;
        }

        .department-description {
          font-size: 14px;
          color: var(--text-muted);
        }

        @media (max-width: 768px) {
          .department-grid {
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
          {/* Header */}
          <div className="page-header">
            <h1 className="page-title">
              <PlusSquare size={26} /> Register Department
            </h1>
            <p className="page-subtitle">
              Create and manage academic departments
            </p>
          </div>

          {/* Form */}
          <form className="form-card" onSubmit={handleSubmit}>
            <h2 className="section-title">Department Information</h2>

            <div className="form-group">
              <label className="form-label">Course *</label>
              <select name="course" className="form-input" value={formData.course} onChange={handleChange}>
                <option value="">Select Course</option>
                {courses.map(c => (
                  <option key={c._id} value={c._id}>{c.courseName}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Department Name *</label>
              <input
                type="text"
                name="departmentName"
                className="form-input"
                value={formData.departmentName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description *</label>
              <input
                type="text"
                name="description"
                className="form-input"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Department Image URL *</label>
              <input
                type="text"
                name="departmentImage"
                className="form-input"
                value={formData.departmentImage}
                onChange={handleChange}
              />
            </div>

            {message.text && (
              <div className={`message ${message.type}`}>
                {message.type === "success" ? <CheckCircle /> : <AlertCircle />}
                <span>{message.text}</span>
              </div>
            )}

            <button className="btn btn-primary" disabled={submitting}>
              {submitting ? "Registering..." : "Register Department"}
            </button>
          </form>

          {/* Departments */}
          <div className="department-list">
            <h2 className="section-title">Registered Departments</h2>

            {departments.length ? (
              <div className="department-grid">
                {departments.map(dep => (
                  <Link to={`/departments/${dep._id}`} key={dep._id} className="department-item">
                    <img src={dep.departmentImage} className="department-image" alt={dep.departmentName} />
                    <div className="department-details">
                      <h4 className="department-name">{dep.departmentName}</h4>
                      <p className="department-description">{dep.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p>No departments registered yet.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminRegisterDepartment;
