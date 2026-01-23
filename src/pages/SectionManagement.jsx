// src/pages/SectionManagement.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";
import { fetchBatchesByDepartment } from "../services/teacherAllocationService.jsx";
import {
  createSection,
  fetchSectionsbyDepartementandBatchandYear,
} from "../services/sectionService.jsx";
import { fetchDepartment } from "../services/attendanceService.jsx";

const SectionManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [batches, setBatches] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [formData, setFormData] = useState({
    department: "",
    batch: "",
    year: "",
    numberOfSections: 1,
    capacity: 60,
    academicYear: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
  });

  const [viewFilters, setViewFilters] = useState({
    department: "",
    batch: "",
    academicYear: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  // ✅ FIXED: Same department fix as SubjectManagement
  const fetchDepartments = async () => {
    try {
      const response = await fetchDepartment();
      if (response.success) {
        setDepartments(response.data);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const fetchBatches = async (departmentId) => {
    try {
      const response = await fetchBatchesByDepartment(departmentId);
      if (response.success) {
        setBatches(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching batches:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDepartmentChange = (e) => {
    const departmentId = e.target.value;
    setFormData({
      ...formData,
      department: departmentId,
      batch: "",
      year: "",
    });
    if (departmentId) {
      fetchBatches(departmentId);
    } else {
      setBatches([]);
    }
  };

  const handleBatchChange = (e) => {
    const batchId = e.target.value;
    const selectedBatch = batches.find((b) => b._id === batchId);
    setFormData({
      ...formData,
      batch: batchId,
      year: selectedBatch?.year || "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "numberOfSections" || name === "capacity" || name === "year"
        ? parseInt(value) || ""
        : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.department || !formData.batch || !formData.year) {
      alert("Please select department, batch, and year");
      setLoading(false);
      return;
    }

    try {
      const sectionData = {
        department: formData.department,
        batch: formData.batch,
        year: formData.year,
        numberOfSections: formData.numberOfSections,
        capacity: formData.capacity,
        academicYear: formData.academicYear,
      };

      const response = await createSection(sectionData);
      if (response.success) {
        alert("Sections created successfully!");
        // Reset form
        setFormData({
          department: "",
          batch: "",
          year: "",
          numberOfSections: 1,
          capacity: 60,
          academicYear: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
        });
        setBatches([]);
      }
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSections = async () => {
    const departmentId = viewFilters.department || "";
    const batchId = viewFilters.batch || "";
    const academicYear = viewFilters.academicYear || "";

    try {
      const response = await fetchSectionsbyDepartementandBatchandYear(
        departmentId,
        batchId,
        academicYear
      );
      if (response.success) {
        setSections(response.data);
      }
    } catch (error) {
      console.error("Error fetching sections:", error);
    }
  };

  const handleViewFiltersChange = (e) => {
    const { name, value } = e.target;
    setViewFilters({
      ...viewFilters,
      [name]: value,
    });
  };

  const handleViewApply = () => {
    fetchSections();
  };

  const handleDeleteSection = async (sectionId) => {
    if (window.confirm("Are you sure you want to deactivate this section?")) {
      try {
        const response = await fetch(`/api/sections/${sectionId}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (data.success) {
          alert("Section deactivated successfully");
          fetchSections();
        }
      } catch (error) {
        alert("Error: " + error.message);
      }
    }
  };

  return (
    <>
      {/* ================= STYLES (EXACT SAME AS SUBJECT MANAGEMENT) ================= */}
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
          padding: 12px 24px;
          font-weight: 600;
          width: 100%;
        }

        .btn-secondary {
          background: #6c757d;
          color: #fff;
          border: none;
          border-radius: 12px;
          padding: 12px 24px;
          font-weight: 500;
          width: 100%;
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
              <h1 className="page-title">Section Management</h1>
              <small className="text-muted">
                Create and manage sections for departments and batches
              </small>
            </div>
          </div>

          {/* CREATE SECTIONS FORM */}
          <section className="card-ui">
            <h5 className="mb-3">Create Sections</h5>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div>
                  <label className="form-label-strong">Department <span style={{ color: "red" }}>*</span></label>
                  <select
                    value={formData.department}
                    onChange={handleDepartmentChange}
                    className="form-control"
                    required
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
                  <label className="form-label-strong">Batch <span style={{ color: "red" }}>*</span></label>
                  <select
                    value={formData.batch}
                    onChange={handleBatchChange}
                    className="form-control"
                    disabled={!formData.department}
                  >
                    <option value="">Select Batch</option>
                    {batches.map((batch) => (
                      <option key={batch._id} value={batch._id}>
                        {batch.batchName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label-strong">Year <span style={{ color: "red" }}>*</span></label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    className="form-control"
                    disabled={!formData.batch}
                  >
                    <option value="">Select Year</option>
                    <option value="1">Year 1</option>
                    <option value="2">Year 2</option>
                    <option value="3">Year 3</option>
                    <option value="4">Year 4</option>
                  </select>
                </div>

                <div>
                  <label className="form-label-strong">Number of Sections</label>
                  <select
                    name="numberOfSections"
                    value={formData.numberOfSections}
                    onChange={handleInputChange}
                    className="form-control"
                  >
                    <option value="1">1 (A)</option>
                    <option value="2">2 (A, B)</option>
                    <option value="3">3 (A, B, C)</option>
                    <option value="4">4 (A, B, C, D)</option>
                    <option value="5">5 (A, B, C, D, E)</option>
                    <option value="6">6 (A, B, C, D, E, F)</option>
                  </select>
                </div>

                <div>
                  <label className="form-label-strong">Student Capacity</label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    min="10"
                    max="200"
                    className="form-control"
                  />
                </div>

                <div>
                  <label className="form-label-strong">Academic Year</label>
                  <input
                    type="text"
                    value={formData.academicYear}
                    onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                    className="form-control"
                    placeholder="e.g., 2025-2026"
                  />
                </div>

                <div style={{ gridColumn: "1 / -1", display: "flex", gap: "12px" }}>
                  <button
                    type="submit"
                    className="btn-main"
                    disabled={loading || !formData.department || !formData.batch || !formData.year}
                  >
                    {loading ? "Creating..." : "Create Sections"}
                  </button>
                </div>
              </div>
            </form>
          </section>

          {/* VIEW FILTERS */}
          <section className="card-ui">
            <h5 className="mb-3">View Sections</h5>
            <div className="filter-grid">
              <div>
                <label className="form-label-strong">Department</label>
                <select
                  name="department"
                  value={viewFilters.department}
                  onChange={handleViewFiltersChange}
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
                <label className="form-label-strong">Batch</label>
                <select
                  name="batch"
                  value={viewFilters.batch}
                  onChange={handleViewFiltersChange}
                  className="form-control"
                >
                  <option value="">All Batches</option>
                  {batches.map((batch) => (
                    <option key={batch._id} value={batch._id}>
                      {batch.batchName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label-strong">Academic Year</label>
                <input
                  type="text"
                  name="academicYear"
                  value={viewFilters.academicYear}
                  onChange={handleViewFiltersChange}
                  className="form-control"
                  placeholder="e.g., 2025-2026"
                />
              </div>

              <div style={{ alignSelf: "end" }}>
                <button
                  onClick={handleViewApply}
                  className="btn-secondary"
                  style={{ height: "100%", padding: "12px 24px" }}
                >
                  Load Sections
                </button>
              </div>
            </div>
          </section>

          {/* SECTIONS TABLE */}
          {sections.length > 0 && (
            <section className="card-ui">
              <h5 className="mb-3">Sections List ({sections.length})</h5>
              <div className="table-wrapper">
                <table className="table table-hover table-bordered mb-0">
                  <thead>
                    <tr>
                      <th>Section</th>
                      <th>Department</th>
                      <th>Batch</th>
                      <th className="text-center">Year</th>
                      <th className="text-center">Capacity</th>
                      <th className="text-center">Academic Year</th>
                      <th className="text-center">Status</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sections.map((section) => (
                      <tr key={section._id}>
                        <td><strong>{section.sectionName}</strong></td>
                        <td>{section.department?.departmentName || "N/A"}</td>
                        <td>{section.batch?.batchName || "N/A"}</td>
                        <td className="text-center">{section.year}</td>
                        <td className="text-center">{section.capacity}</td>
                        <td className="text-center">{section.academicYear}</td>
                        <td className="text-center">
                          <span
                            className="status-pill"
                            style={{
                              backgroundColor: section.isActive ? "#10b981" : "#ef4444"
                            }}
                          >
                            {section.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="text-center">
                          <button
                            onClick={() => handleDeleteSection(section._id)}
                            className="btn btn-sm btn-danger"
                            style={{ borderRadius: "6px", padding: "4px 12px" }}
                          >
                            Deactivate
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {sections.length === 0 && (viewFilters.department || viewFilters.batch || viewFilters.academicYear) && (
            <section className="card-ui text-center py-5" style={{ backgroundColor: "#f8fafc" }}>
              <div style={{ color: "#64748b", fontSize: "16px" }}>
                No sections found for the selected criteria
              </div>
            </section>
          )}
        </main>
      </div>
    </>
  );
};

export default SectionManagement;
