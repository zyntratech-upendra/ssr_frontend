import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { getAllDepartments, fetchTeacherByDepartment } from "../services/departmentService";
import { fetchBatchesByDepartment } from "../services/teacherAllocationService.jsx";
import { teacherClasses } from "../services/timetableService.jsx";
import "bootstrap/dist/css/bootstrap.min.css";

const TeacherClasses = () => {
  const [teachers, setTeachers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [batches, setBatches] = useState([]);
  const [classes, setClasses] = useState({});
  const [loading, setLoading] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [filters, setFilters] = useState({
    teacher: "",
    department: "",
    batch: "",
    academicYear: new Date().getFullYear() + "-" + (new Date().getFullYear() + 1),
  });

  const [loadingDepts, setLoadingDepts] = useState(true);
  const [loadingFull, setLoadingFull] = useState(true);

  useEffect(() => {
    setLoadingFull(true);
    const timer = setTimeout(() => setLoadingFull(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const res = await getAllDepartments();
        if (!alive) return;
        if (res?.success) setDepartments(res.data || []);
      } catch (err) {
        console.error("Departments fetch error", err);
      } finally {
        setTimeout(() => {
          if (alive) setLoadingDepts(false);
        }, 1000);
      }
    };
    load();
    return () => { alive = false; };
  }, []);

  // load teachers & batches for selected department
  const handleDepartmentChange = async (e) => {
    setLoadingFull(true);                        // <-- add skeleton loading on department change
    const departmentId = e.target.value;
    setFilters({
      ...filters,
      department: departmentId,
      batch: "",
      teacher: "",
    });
    setTeachers([]);
    setBatches([]);
    setClasses({});

    if (!departmentId) {
      setLoadingFull(false);
      return;
    }

    try {
      // fetch teachers & batches in parallel
      const [teacherRes, batchRes] = await Promise.all([
        fetchTeacherByDepartment(departmentId).catch((r) => ({ success: false })),
        fetchBatchesByDepartment(departmentId).catch((r) => ({ success: false })),
      ]);

      if (teacherRes?.success) setTeachers(teacherRes.data || []);
      if (batchRes?.success) setBatches(batchRes.data || []);
    } catch (err) {
      console.error("Error loading teachers/batches", err);
    } finally {
      setTimeout(() => setLoadingFull(false), 1000);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    if (e.target.name === "teacher") setClasses({});
  };

  const fetchTeacherClassesData = async () => {
    if (!filters.teacher) return alert("Please select a teacher");

    setLoading(true);
    setClasses({});

    try {
      const response = await teacherClasses(
        filters.teacher,
        filters.department,
        filters.batch,
        filters.academicYear
      );

      if (response?.success) {
        // group by dayOfWeek 
        const grouped = {};
        (response.data || []).forEach((item) => {
          const day = item.dayOfWeek || "Other";
          if (!grouped[day]) grouped[day] = [];
          grouped[day].push(item);
        });

        // sort entries in each day by startTime
        Object.keys(grouped).forEach((d) => {
          grouped[d].sort((a, b) => {
            if (!a.startTime) return 1;
            if (!b.startTime) return -1;
            return a.startTime.localeCompare(b.startTime);
          });
        });

        setClasses(grouped);
      } else {
        setClasses({});
        alert(response?.message || "No classes found for the chosen teacher");
      }
    } catch (err) {
      console.error("Error fetching classes", err);
      alert("Failed to fetch teacher classes. See console.");
    } finally {
      setLoading(false);
    }
  };

  // Weekday display order
  const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  // Teacher display
  const selectedTeacher = teachers.find((t) => t._id === filters.teacher);

  // Soft color by time for timetable cards
  const getTimeColor = (startTime) => {
    if (!startTime) return "#ffffff";
    const hour = parseInt(startTime.split(":")[0], 10);
    if (hour < 10) return "#f3f0ff"; // morning - light purple
    if (hour < 14) return "#fff8e6"; // midday - light amber
    if (hour < 17) return "#f0f7ff"; // afternoon - light blue
    return "#f6f0ff"; // evening - soft lilac
  };

  return (
    <>
      <style>{`
        :root {
          --primary: #5b2c6f;
          --accent: #8e44ad;
          --muted: #6c757d;
          --bg: #f4f6fb;
          --card: #fff;
          --shadow: rgba(27,31,40,0.08);
          --radius: 18px;
        }
        body {
          background: linear-gradient(135deg, #f7f5fb, #eef7ff);
        }
        .page { display: flex; min-height: 100vh; }
        .main {
          flex: 1;
          padding: 24px 14px;
          transition: margin-left .28s ease;
          position: relative;
        }
        .main-loading-overlay {
          position: absolute;
          left: 0; top: 0;
          width: 100%; height: 100%;
          background: rgba(246,247,251, 0.95);
          z-index: 111;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .main-skeleton-box {
          width: 85vw;
          max-width: 950px;
          height: 55vh;
          max-height: 330px;
          background: linear-gradient(90deg, #e9e9ed 25%, #f6f6f8 50%, #e9e9ed 75%);
          animation: shimmer 1.4s infinite;
          border-radius: 30px;
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .page-header {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
        }
        .big-title {
          color: var(--primary);
          font-weight: 800;
          font-size: 2rem;
          letter-spacing: -1px;
          margin: 0 0 4px 0;
        }
        .subtitle {
          color: var(--muted);
          font-size: 1.03rem;
          margin-top: 1px;
        }
        .card {
          background: var(--card);
          border-radius: var(--radius);
          padding: 16px 10px;
          box-shadow: 0 7px 24px var(--shadow);
          margin-bottom: 16px;
        }
        .form-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          margin-bottom: 0;
        }
        .form-grid .form-control, .form-grid .form-select {
          border-radius: 8px;
          padding: 9px 11px;
          border: 1px solid #e2e2ee;
        }
        .btn-primary-modern {
          background: linear-gradient(90deg, var(--primary), var(--accent));
          border: none;
          color: white;
          padding: 10px 18px;
          font-weight: 700;
          border-radius: 10px;
          font-size: 1rem;
          letter-spacing: 0.02em;
          box-shadow: 0 6px 18px rgba(88, 39, 111, 0.12);
        }
        .btn-primary-modern:disabled {
          opacity: 0.68;
        }
        .skeleton {
          height: 15px;
          border-radius: 8px;
          background: linear-gradient(90deg,#e6e6e6 25%, #f4f4f4 50%, #e6e6e6 75%);
          background-size: 200% 100%;
          animation: shimmer 1.2s infinite linear;
        }
        /* Schedule grid */
        .week-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }
        .day-card {
          border-radius: 13px;
          padding: 13px 8px;
          background: linear-gradient(180deg, rgba(250,250,255,0.92), #fff 80%);
          border: 1.2px solid #f0edf6;
          min-width: 0;
        }
        .day-title {
          font-weight: 700;
          color: var(--primary);
          margin-bottom: 10px;
          font-size: 1.1rem;
          letter-spacing: 0.03em;
        }
        .session-card {
          border-radius: 7px;
          padding: 10px;
          margin-bottom: 10px;
          border: 1px solid rgba(91,44,111,0.07);
          font-size: 0.97rem;
        }
        .teacher-info {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .teacher-avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--accent), var(--primary));
          display:flex;
          align-items:center;
          justify-content:center;
          color:white;
          font-weight:900;
          font-size:1.7rem;
          box-shadow: 0 6px 14px rgba(133,47,140,0.13);
        }
        .muted-sm { color: var(--muted); font-size: .97rem; }
        /* Responsive */
        @media (max-width: 1200px) {
          .form-grid { grid-template-columns: repeat(3,1fr);}
          .week-grid { grid-template-columns: repeat(2,1fr);}
        }
        @media (max-width: 940px) {
          .form-grid { grid-template-columns: repeat(2,1fr);}
          .week-grid { grid-template-columns: 1fr;}
          .main { padding: 9px 3vw; }
          .big-title { font-size: 1.32rem; }
        }
        @media (max-width: 640px) {
          .form-grid { grid-template-columns: 1fr;}
          .main { padding: 5px 1vw; }
          .card { padding: 8px 2px;}
          .big-title { font-size: 1.04rem;}
        }
      `}</style>
      <div className="page">
        <Sidebar onToggle={setSidebarOpen} />
        <main className="main" style={{ marginLeft: sidebarOpen ? "250px" : "80px" }}>
          {loadingFull && (
            <div className="main-loading-overlay">
              <div className="main-skeleton-box"></div>
            </div>
          )}
          <div className="page-header">
            <div>
              <h1 className="big-title">Teacher Classes & Schedule</h1>
              <div className="subtitle">Choose department, batch and teacher to load weekly timetable</div>
            </div>
            <div style={{ display: "flex", gap: 9, alignItems: "center", flexWrap: "wrap" }}>
              <button
                className="btn btn-outline-secondary"
                onClick={() => {
                  setFilters({
                    teacher: "",
                    department: "",
                    batch: "",
                    academicYear: new Date().getFullYear() + "-" + (new Date().getFullYear() + 1),
                  });
                  setTeachers([]);
                  setBatches([]);
                  setClasses({});
                }}
              >
                Reset
              </button>
            </div>
          </div>
          {/* FILTERS CARD */}
          <div className="card">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h4 style={{ margin: 0, fontWeight:700, color:'var(--primary)', letterSpacing:'-0.5px', fontSize:'1.1rem' }}>Select Teacher</h4>
                <div className="muted-sm" style={{fontSize:"0.87rem"}}>Load classes for a specific teacher</div>
              </div>
            </div>
            <div className="form-grid mb-3">
              {/* Department */}
              <div>
                <label className="form-label">Department</label>
                {loadingDepts ? (
                  <div className="skeleton" style={{ width: "100%" }} />
                ) : (
                  <select
                    className="form-select"
                    name="department"
                    value={filters.department}
                    onChange={handleDepartmentChange}
                  >
                    <option value="">Select Department</option>
                    {departments.map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.departmentName}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              {/* Batch */}
              <div>
                <label className="form-label">Batch (optional)</label>
                <select
                  className="form-select"
                  name="batch"
                  value={filters.batch}
                  onChange={handleFilterChange}
                  disabled={!filters.department}
                >
                  <option value="">{!filters.department ? "Select department first" : "Select batch"}</option>
                  {batches.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.batchName}
                    </option>
                  ))}
                </select>
              </div>
              {/* Teacher */}
              <div>
                <label className="form-label">Teacher *</label>
                <select
                  className="form-select"
                  name="teacher"
                  value={filters.teacher}
                  onChange={handleFilterChange}
                >
                  <option value="">Select Teacher</option>
                  {teachers.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name} {t.email ? `(${t.email})` : ""}
                    </option>
                  ))}
                </select>
              </div>
              {/* Academic Year */}
              <div>
                <label className="form-label">Academic Year</label>
                <input
                  className="form-control"
                  name="academicYear"
                  value={filters.academicYear}
                  onChange={handleFilterChange}
                />
              </div>
              {/* buttons area spans columns visually */}
              <div style={{ gridColumn: "1 / -1", display: "flex", gap: 9, marginTop: 6, flexWrap: "wrap" }}>
                <button
                  className="btn-primary-modern"
                  onClick={fetchTeacherClassesData}
                  disabled={loading || !filters.teacher}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" />
                      Loading...
                    </>
                  ) : (
                    "Load Teacher Classes"
                  )}
                </button>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    setFilters({ ...filters, teacher: "", batch: "" });
                    setClasses({});
                  }}
                >
                  Clear Teacher
                </button>
              </div>
            </div>
          </div>
          {/* Teacher info & summary */}
          {selectedTeacher && Object.keys(classes).length > 0 && (
            <div className="card d-flex gap-4 align-items-start">
              <div className="teacher-info">
                <div className="teacher-avatar">
                  {selectedTeacher.name ? selectedTeacher.name.split(" ").map(n => n[0]).slice(0,2).join("") : "T"}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--primary)" }}>{selectedTeacher.name}</div>
                  <div className="muted-sm" style={{fontSize:'0.92rem'}}>{selectedTeacher.email}</div>
                  <div className="muted-sm">{selectedTeacher.department?.departmentName || ""}</div>
                </div>
              </div>
            </div>
          )}
          {/* Weekly schedule */}
          {Object.keys(classes).length > 0 ? (
            <>
              <div style={{ marginBottom: 13, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                <h3 style={{ margin: 0, color: "var(--primary)", fontWeight:700, fontSize:'1.22rem', letterSpacing:'-0.5px' }}>Weekly Schedule</h3>
                <div className="muted-sm" style={{marginLeft:8, fontSize:"0.93rem"}}>Tip: tap a card to view room/subject details</div>
              </div>
              <div className="week-grid">
                {dayOrder.map((day) => {
                  const dayItems = classes[day] || [];
                  return (
                    <div key={day} className="day-card">
                      <div className="day-title">{day}</div>
                      {dayItems.length === 0 ? (
                        <div className="muted-sm" style={{fontSize:"0.92rem"}}>No classes</div>
                      ) : (
                        dayItems.map((c, idx) => (
                          <div
                            key={idx}
                            className="session-card"
                            style={{ background: getTimeColor(c.startTime) }}
                          >
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                              <div style={{ fontWeight: 700, color: "var(--primary)" }}>{c.subject?.subjectName || "Subject"}</div>
                              <div className="muted-sm" style={{fontWeight:600}}>
                                {c.startTime} - {c.endTime}
                              </div>
                            </div>
                            <div className="muted-sm" style={{fontSize:"0.96rem"}}>Period: {c.periodNumber || "-"}</div>
                            <div style={{ marginTop: 5 }}>
                              <div style={{ fontWeight: 600 }}>{c.batch?.batchName || "-"} - Section {c.section || "-"}</div>
                              <div className="muted-sm" style={{fontSize:"0.89rem"}}>Room: {c.roomNumber || "TBD"} | Code: {c.subject?.subjectCode || "-"}</div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            // Empty state message (show if teacher selected & not loading)
            filters.teacher && !loading && (
              <div className="card text-center">
                <div style={{ fontWeight: 700, color: "var(--muted)", fontSize:'1.07rem' }}>No classes found for selected teacher</div>
                <div className="muted-sm" style={{fontSize:"0.9rem"}}>Try changing batch / academic year or contact admin if this seems incorrect.</div>
              </div>
            )
          )}
        </main>
      </div>
    </>
  );
};

export default TeacherClasses;
