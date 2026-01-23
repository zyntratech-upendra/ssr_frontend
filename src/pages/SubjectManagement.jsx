// src/pages/SubjectManagement.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";
import { createSubject, fetchAllSubjects, updateSubject, deleteSubject } from "../services/subjectService.jsx";
import { fetchDepartment } from "../services/attendanceService.jsx";

const SubjectManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);

  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterSemester, setFilterSemester] = useState("");

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [formData, setFormData] = useState({
    subjectName: "",
    subjectCode: "",
    department: "",
    year: 1,
    semester: 1,
    credits: 3,
    subjectType: "Theory",
    description: "",
  });

  const subjectTypes = ["Theory", "Practical", "Lab", "Project", "Elective"];

  useEffect(() => {
    fetchDepartments();
    fetchSubjects();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [subjects, filterDepartment, filterYear, filterSemester]);

  const fetchDepartments = async () => {
    try {
      const response = await fetchDepartment();
      const data = response.data;
      if (response.success) {
        setDepartments(data);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const data = await fetchAllSubjects();
      if (data.success) {
        setSubjects(data.data);
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const applyFilters = () => {
    let filtered = [...subjects];

    if (filterDepartment) {
      filtered = filtered.filter((s) => s.department?._id === filterDepartment);
    }
    if (filterYear) {
      filtered = filtered.filter((s) => s.year === parseInt(filterYear));
    }
    if (filterSemester) {
      filtered = filtered.filter((s) => s.semester === parseInt(filterSemester));
    }

    setFilteredSubjects(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSubject) {
        const data = await updateSubject(editingSubject._id, formData);
        if (data.success) {
          alert("Subject updated successfully!");
        }
      } else {
        const data = await createSubject(formData);
        if (data.success) {
          alert("Subject created successfully!");
        }
      }
      resetForm();
      fetchSubjects();
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const handleEdit = (subject) => {
    setEditingSubject(subject);
    setFormData({
      subjectName: subject.subjectName,
      subjectCode: subject.subjectCode,
      department: subject.department._id,
      year: subject.year,
      semester: subject.semester,
      credits: subject.credits,
      subjectType: subject.subjectType || "Theory",
      description: subject.description || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subject?")) return;

    try {
      const data = await deleteSubject(id);
      if (data.success) {
        alert("Subject deleted successfully");
        fetchSubjects();
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      subjectName: "",
      subjectCode: "",
      department: "",
      year: 1,
      semester: 1,
      credits: 3,
      subjectType: "Theory",
      description: "",
    });
    setEditingSubject(null);
    setShowForm(false);
  };

  return (
    <>
      {/* ================= STYLES ================= */}
      <style>{`
        :root {
          --primary: #ad8ff8;
          --primary-dark: #8b6fe6;
          --soft: #f5f1ff;
          --text: #1e293b;
          --muted: #64748b;
        }

        body {
          background: linear-gradient(135deg,#f7f4ff,#eef2ff);
        }

        .admin-layout {
          display: flex;
          height: 100vh;
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
        }

        .card-ui {
          background: #fff;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 10px 28px rgba(0,0,0,.08);
          margin-bottom: 22px;
        }

        .btn-main {
          background: linear-gradient(135deg,var(--primary-dark),var(--primary));
          color: #fff;
          border: none;
          border-radius: 12px;
          padding: 10px 18px;
          font-weight: 600;
        }

        .btn-danger-soft {
          background: #dc3545;
          color: #fff;
          border-radius: 12px;
          border: none;
          padding: 10px 18px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit,minmax(220px,1fr));
          gap: 16px;
        }

        .filter-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit,minmax(200px,1fr));
          gap: 16px;
        }

        .table-wrapper {
          max-height: 420px;
          overflow: auto;
        }

        .table thead th {
          position: sticky;
          top: 0;
          background: linear-gradient(135deg,var(--primary),var(--primary-dark));
          color: #fff;
          white-space: nowrap;
          z-index: 2;
        }

        .status-pill {
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 12px;
          color: #fff;
          font-weight: 600;
        }

        .form-label-strong {
          display: block;
          margin-bottom: 5px;
          font-weight: 600;
          font-size: 14px;
          color: var(--text);
        }

        @media (max-width: 768px) {
          .page-title { text-align: center; }
          .header-flex { justify-content: center; }
          .form-grid, .filter-grid { grid-template-columns: 1fr; }
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
          <div className="d-flex justify-content-between align-items-center mb-3 header-flex flex-wrap gap-2">
            <div>
              <h1 className="page-title">Subject Management</h1>
              <small className="text-muted">
                Create, update and manage all subjects across departments
              </small>
            </div>

            <button
              className={showForm ? "btn-danger-soft" : "btn-main"}
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? "Cancel" : "+ Create Subject"}
            </button>
          </div>

          {/* FORM */}
          {showForm && (
            <section className="card-ui">
              <h5 className="mb-3">
                {editingSubject ? "Edit Subject" : "Create New Subject"}
              </h5>

              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div>
                    <label className="form-label-strong">
                      Subject Name <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.subjectName}
                      onChange={(e) =>
                        setFormData({ ...formData, subjectName: e.target.value })
                      }
                      required
                      placeholder="e.g., Data Structures"
                      className="form-control"
                    />
                  </div>

                  <div>
                    <label className="form-label-strong">
                      Subject Code <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.subjectCode}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          subjectCode: e.target.value.toUpperCase(),
                        })
                      }
                      required
                      placeholder="e.g., CS201"
                      className="form-control"
                    />
                  </div>

                  <div>
                    <label className="form-label-strong">
                      Department/Branch <span style={{ color: "red" }}>*</span>
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) =>
                        setFormData({ ...formData, department: e.target.value })
                      }
                      required
                      className="form-control"
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept._id} value={dept._id}>
                          {dept.departmentName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="form-label-strong">
                      Year <span style={{ color: "red" }}>*</span>
                    </label>
                    <select
                      value={formData.year}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          year: parseInt(e.target.value),
                        })
                      }
                      required
                      className="form-control"
                    >
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label-strong">
                      Semester <span style={{ color: "red" }}>*</span>
                    </label>
                    <select
                      value={formData.semester}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          semester: parseInt(e.target.value),
                        })
                      }
                      required
                      className="form-control"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                        <option key={sem} value={sem}>
                          Semester {sem}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="form-label-strong">
                      Subject Type <span style={{ color: "red" }}>*</span>
                    </label>
                    <select
                      value={formData.subjectType}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          subjectType: e.target.value,
                        })
                      }
                      required
                      className="form-control"
                    >
                      {subjectTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="form-label-strong">Credits</label>
                    <input
                      type="number"
                      value={formData.credits}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          credits: parseInt(e.target.value),
                        })
                      }
                      min="1"
                      max="6"
                      className="form-control"
                    />
                  </div>

                  <div style={{ gridColumn: "1 / -1" }}>
                    <label className="form-label-strong">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      placeholder="Brief description of the subject (optional)"
                      rows="3"
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="mt-3 d-flex gap-2 flex-wrap">
                  <button
                    type="submit"
                    className="btn-main"
                    style={{ padding: "10px 24px" }}
                  >
                    {editingSubject ? "Update Subject" : "Create Subject"}
                  </button>
                  {editingSubject && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="btn"
                      style={{
                        padding: "10px 24px",
                        backgroundColor: "#6c757d",
                        color: "white",
                        border: "none",
                        borderRadius: "12px",
                        fontWeight: "500",
                      }}
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </section>
          )}

          {/* FILTERS */}
          <section className="card-ui">
            <h5 className="mb-3">Filter Subjects</h5>
            <div className="filter-grid">
              <div>
                <label className="form-label-strong">Filter by Department</label>
                <select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  className="form-control"
                >
                  <option value="">All Departments</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.departmentName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label-strong">Filter by Year</label>
                <select
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                  className="form-control"
                >
                  <option value="">All Years</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>

              <div>
                <label className="form-label-strong">Filter by Semester</label>
                <select
                  value={filterSemester}
                  onChange={(e) => setFilterSemester(e.target.value)}
                  className="form-control"
                >
                  <option value="">All Semesters</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <option key={sem} value={sem}>
                      Semester {sem}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* TABLE */}
          <section className="card-ui">
            <h5 className="mb-3">
              All Subjects ({filteredSubjects.length})
            </h5>

            <div className="table-wrapper">
              <table className="table table-hover table-bordered mb-0">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Subject Name</th>
                    <th>Department</th>
                    <th className="text-center">Year</th>
                    <th className="text-center">Semester</th>
                    <th className="text-center">Type</th>
                    <th className="text-center">Credits</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubjects.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-3 text-muted">
                        No subjects found
                      </td>
                    </tr>
                  ) : (
                    filteredSubjects.map((subject) => (
                      <tr key={subject._id}>
                        <td>
                          <strong>{subject.subjectCode}</strong>
                        </td>
                        <td>{subject.subjectName}</td>
                        <td>{subject.department?.departmentName || "N/A"}</td>
                        <td className="text-center">{subject.year}</td>
                        <td className="text-center">{subject.semester}</td>
                        <td className="text-center">
                          <span
                            className="status-pill"
                            style={{
                              background:
                                subject.subjectType === "Practical" ||
                                subject.subjectType === "Lab"
                                  ? "#f59e0b"
                                  : "#3b82f6",
                            }}
                          >
                            {subject.subjectType || "Theory"}
                          </span>
                        </td>
                        <td className="text-center">{subject.credits}</td>
                        <td className="text-center">
                          <button
                            onClick={() => handleEdit(subject)}
                            className="btn btn-sm btn-success me-2"
                            style={{ borderRadius: "6px" }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(subject._id)}
                            className="btn btn-sm btn-danger"
                            style={{ borderRadius: "6px" }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default SubjectManagement;
