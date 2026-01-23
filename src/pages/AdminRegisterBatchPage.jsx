import { useState, useEffect } from "react";
import { CheckCircle, AlertCircle, Layers } from "lucide-react";
import Sidebar from "../components/Sidebar";
import {
  createBatch,
  getAllDepartments,
  getAllBatches,
} from "../services/batchService";
import courseService from "../services/courseService";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminRegisterBatchPage = () => {
  const [batchFormData, setBatchFormData] = useState({
    startYear: new Date().getFullYear(),
  });
  const [batchMessage, setBatchMessage] = useState({ type: "", text: "" });

  const [allDepartments, setAllDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [batches, setBatches] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [depsResp, batchesResp] = await Promise.all([
        getAllDepartments(),
        getAllBatches(),
      ]);
      const coursesResp = await courseService.getAllCourses();

      if (depsResp?.success) setAllDepartments(depsResp.data || []);
      if (batchesResp?.success) setBatches(batchesResp.data || []);
      setCourses(coursesResp || []);
    } catch (err) {
      console.error("Failed to fetch data", err);
    }
  };

  const handleDepartmentCheckbox = (deptId) => {
    if (selectedDepartments.find((d) => d.departmentId === deptId)) {
      setSelectedDepartments(
        selectedDepartments.filter((d) => d.departmentId !== deptId)
      );
    } else {
      setSelectedDepartments([
        ...selectedDepartments,
        { departmentId: deptId, numberOfSections: 1 },
      ]);
    }
  };

  const handleSectionChange = (deptId, value) => {
    setSelectedDepartments(
      selectedDepartments.map((d) =>
        d.departmentId === deptId
          ? { ...d, numberOfSections: value }
          : d
      )
    );
  };

  const handleBatchSubmit = async (e) => {
    e.preventDefault();
    setBatchMessage({ type: "", text: "" });

    if (!selectedCourse || selectedDepartments.length === 0) {
      setBatchMessage({
        type: "error",
        text: "Please select course and at least one department",
      });
      return;
    }

    const startYear = parseInt(batchFormData.startYear, 10);
    const endYear = startYear + 3;
    const batchName = `${startYear}-${endYear}`;

    try {
      const response = await createBatch({
        batchName,
        course: selectedCourse,
        departments: selectedDepartments,
      });

      if (response.success) {
        setBatchMessage({
          type: "success",
          text: "Batch created successfully!",
        });
        setSelectedDepartments([]);
        setBatches((prev) => [...prev, response.data]);
      } else {
        setBatchMessage({
          type: "error",
          text: response.message || "Failed to create batch",
        });
      }
    } catch {
      setBatchMessage({
        type: "error",
        text: "Failed to create batch. Try again.",
      });
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

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
          transition: margin-left .36s ease;
        }

        .page-header {
          margin-bottom: 28px;
        }

        .page-title {
          font-size: clamp(22px,2.5vw,28px);
          font-weight: 700;
          color: var(--primary-dark);
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .page-subtitle {
          color: var(--text-muted);
          margin-top: 6px;
        }

        .card-box {
          background: linear-gradient(135deg,#fff,var(--primary-soft));
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

        label {
          font-weight: 600;
          margin-bottom: 6px;
          display: block;
        }

        select, input[type="number"] {
          width: 100%;
          padding: 12px;
          border-radius: 12px;
          border: 1px solid var(--border);
        }

        .department-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 14px;
          background: #fff;
          border-radius: 12px;
          margin-bottom: 10px;
          box-shadow: 0 6px 18px rgba(0,0,0,.06);
        }

        .btn-primary {
          background: linear-gradient(135deg,var(--primary-dark),var(--primary));
          border-radius: 12px;
          padding: 12px 22px;
          font-weight: 600;
          border: none;
        }

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

        /* 🟣 TWO COLUMN GRID */
        .batch-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 20px;
        }

        .batch-card {
          background: #fff;
          border-radius: 14px;
          padding: 18px;
          box-shadow: 0 10px 28px rgba(0,0,0,.06);
          transition: .25s ease;
        }

        .batch-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 36px rgba(173,143,248,.35);
        }

        .batch-card h4 {
          color: var(--primary-dark);
          font-weight: 700;
          margin-bottom: 10px;
        }

        @media (max-width: 992px) {
          .batch-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .department-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
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
            <h1 className="page-title">
              <Layers size={26} /> Register Batches
            </h1>
            <p className="page-subtitle">
              Create and manage academic batches
            </p>
          </div>

          {/* FORM */}
          <form className="card-box" onSubmit={handleBatchSubmit}>
            <h2 className="section-title">Batch Information</h2>

            <label>Start Year</label>
            <select
              value={batchFormData.startYear}
              onChange={(e) =>
                setBatchFormData({ startYear: e.target.value })
              }
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>

            <label className="mt-3">Course</label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              <option value="">Select Course</option>
              {courses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.courseName}
                </option>
              ))}
            </select>

            <label className="mt-3">Departments</label>
            {allDepartments
              .filter((d) => String(d.course) === String(selectedCourse))
              .map((dept) => {
                const isSelected = selectedDepartments.find(
                  (d) => d.departmentId === dept._id
                );
                return (
                  <div key={dept._id} className="department-row">
                    <div>
                      <input
                        type="checkbox"
                        checked={!!isSelected}
                        onChange={() =>
                          handleDepartmentCheckbox(dept._id)
                        }
                      />{" "}
                      <strong>{dept.departmentName}</strong>
                    </div>

                    {isSelected && (
                      <input
                        type="number"
                        min="1"
                        value={isSelected.numberOfSections}
                        onChange={(e) =>
                          handleSectionChange(
                            dept._id,
                            parseInt(e.target.value, 10)
                          )
                        }
                        style={{ width: 90 }}
                      />
                    )}
                  </div>
                );
              })}

            {batchMessage.text && (
              <div className={`message ${batchMessage.type}`}>
                {batchMessage.type === "success" ? (
                  <CheckCircle />
                ) : (
                  <AlertCircle />
                )}
                <span>{batchMessage.text}</span>
              </div>
            )}

            <button className="btn btn-primary mt-3">
              Create Batch
            </button>
          </form>

          {/* EXISTING BATCHES */}
          <div className="card-box">
            <h2 className="section-title">Existing Batches</h2>

            <div className="batch-grid">
              {batches.map((batch) => (
                <div key={batch._id} className="batch-card">
                  <h4>{batch.batchName}</h4>
                  {batch.departments?.map((d) => (
                    <p key={d.departmentId}>
                      <strong>{d.departmentName}</strong> —{" "}
                      {d.numberOfSections} Sections
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminRegisterBatchPage;
