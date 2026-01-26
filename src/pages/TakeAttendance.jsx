import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import {
  fetchTeacherTimetableId,
  fetchStudentbyBatchandSection,
  attendenceofStudents,
} from "../services/attendanceService";
import "bootstrap/dist/css/bootstrap.min.css";

const TakeAttendance = ({ teacherId }) => {
  const [timetables, setTimetables] = useState({});
  const [selectedTimetable, setSelectedTimetable] = useState(null);
  const [students, setStudents] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTimetable, setIsLoadingTimetable] = useState(false);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loadingFull, setLoadingFull] = useState(true);
  const [attendanceAlreadyTaken, setAttendanceAlreadyTaken] = useState(false);

  useEffect(() => {
    setLoadingFull(true);
    const timer = setTimeout(() => setLoadingFull(false), 1000);
    return () => clearTimeout(timer);
  }, [teacherId]);

  useEffect(() => {
    if (teacherId) fetchTeacherTimetable();
    // eslint-disable-next-line
  }, [teacherId]);

  const fetchTeacherTimetable = async () => {
    setIsLoadingTimetable(true);
    setError(null);
    try {
      const response = await fetchTeacherTimetableId(teacherId);
      if (response?.success) {
        setTimetables(response.data || {});
      } else {
        setTimetables({});
        setError(response?.message || "Unable to load timetable.");
      }
    } catch (err) {
      console.error("Fetch timetable error:", err);
      setError("Network error while fetching timetable.");
    } finally {
      setIsLoadingTimetable(false);
    }
  };

  const fetchStudents = async (batchId, section) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchStudentbyBatchandSection(batchId, section);
      if (response?.success) {
        const data = response.data || [];
        setStudents(data);
        const initialRecords = data.map((student) => ({
          student: student._id,
          status: "Present",
          remarks: "",
        }));
        setAttendanceRecords(initialRecords);
      } else {
        setStudents([]);
        setAttendanceRecords([]);
        setError(response?.message || "Failed to fetch students.");
      }
    } catch (err) {
      console.error("Fetch students error:", err);
      setStudents([]);
      setAttendanceRecords([]);
      setError("Network error while fetching students.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTimetableSelect = (timetable) => {
    setSelectedTimetable(timetable);
    setLoadingFull(true);
    // Check if attendance already taken for this timetable on this date
    checkIfAttendanceExists(timetable);
    setTimeout(() => setLoadingFull(false), 1000);
    fetchStudents(timetable.batch._id, timetable.section);
  };

  const checkIfAttendanceExists = async (timetable) => {
    try {
      const response = await fetch(
        `/api/attendance?timetable=${timetable._id}&date=${selectedDate}`,
        {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      if (data.success && data.data && data.data.length > 0) {
        setAttendanceAlreadyTaken(true);
      } else {
        setAttendanceAlreadyTaken(false);
      }
    } catch (err) {
      console.error("Error checking attendance:", err);
      setAttendanceAlreadyTaken(false);
    }
  };

  const handleStatusChange = (studentId, status) => {
    setAttendanceRecords((prev) =>
      prev.map((record) =>
        record.student === studentId ? { ...record, status } : record
      )
    );
  };

  const handleRemarksChange = (studentId, remarks) => {
    setAttendanceRecords((prev) =>
      prev.map((record) =>
        record.student === studentId ? { ...record, remarks } : record
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTimetable) {
      alert("Please select a class period.");
      return;
    }
    if (!attendanceRecords.length) {
      alert("No attendance to submit.");
      return;
    }

    // Check if attendance already taken
    if (attendanceAlreadyTaken) {
      const proceed = window.confirm(
        "⚠️ Attendance has already been marked for this period on this date.\n\nDo you want to update it?"
      );
      if (!proceed) return;
    }

    const payload = {
      timetable: selectedTimetable._id,
      subject: selectedTimetable.subject?._id,
      teacher: teacherId,
      department: selectedTimetable.department?._id,
      batch: selectedTimetable.batch?._id,
      section: selectedTimetable.section,
      date: selectedDate,
      periodNumber: selectedTimetable.periodNumber,
      attendanceRecords,
      academicYear: selectedTimetable.academicYear,
      markedBy: teacherId,
    };

    try {
      setIsLoading(true);
      const response = await attendenceofStudents(payload);
      if (response?.success) {
        alert("Attendance marked successfully!");
        setSelectedTimetable(null);
        setStudents([]);
        setAttendanceRecords([]);
        setAttendanceAlreadyTaken(false);
      } else {
        alert(response?.message || "Failed to mark attendance.");
      }
    } catch (err) {
      console.error("Submit attendance error:", err);
      alert("Network error while submitting attendance.");
    } finally {
      setIsLoading(false);
    }
  };

  const markAllPresent = () =>
    setAttendanceRecords((prev) => prev.map((r) => ({ ...r, status: "Present" })));

  const markAllAbsent = () =>
    setAttendanceRecords((prev) => prev.map((r) => ({ ...r, status: "Absent" })));

  const getCurrentDayTimetable = () => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const today = days[new Date().getDay()];
    return timetables[today] || [];
  };

  const presentCount = attendanceRecords.filter((r) => r.status === "Present").length;
  const absentCount = attendanceRecords.filter((r) => r.status === "Absent").length;

  return (
    <>
      <style>{`
        :root{
          --primary: #5b2c6f;
          --accent: #8e44ad;
          --muted: #6c757d;
          --card: #ffffff;
          --bg: linear-gradient(135deg, #f7f5fb, #eef7fb);
          --glass-shadow: 0 10px 30px rgba(27,31,40,0.06);
        }
        body { background: var(--bg); font-family: 'Poppins', sans-serif; }
        .take-attendance-page { display: flex; min-height: 100vh; }
        main.att-main {
          flex: 1;
          padding: 36px 30px 18px 30px;
          transition: margin-left .28s ease;
          overflow: auto;
          position: relative;
          min-height: 100vh;
        }
        
        .main-loading-overlay {
          position: absolute;
          left: 0; top: 0;
          width: 100%; height: 100%;
          background: rgba(246,247,251, 0.95);
          z-index: 100;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .main-skeleton-box {
          width: 85vw;
          max-width: 900px;
          height: 50vh;
          max-height: 350px;
          background: linear-gradient(90deg, #e9e9ed 25%, #f6f6f8 50%, #e9e9ed 75%);
          animation: shimmer 1.4s infinite;
          border-radius: 28px;
        }
        @keyframes shimmer {
          0% { background-position: -200% 0 }
          100% { background-position: 200% 0 }
        }
        .header {
          display:flex;
          flex-direction:column;
          gap:10px;
          margin-bottom: 17px;
        }
        .title {
          color: var(--primary);
          font-size: 2.6rem;
          font-weight: 800;
          margin:0;
          text-align:center;
          letter-spacing:-.9px;
        }
        .subtitle {
          color: var(--muted);
          margin-top:6px;
          font-size:1.18rem;
          text-align:center;
          font-weight:500;
        }
        .date-row-center {
          width:100%;
          display:flex;
          justify-content:center;
          margin-bottom: 22px;
          gap:16px;
          flex-wrap:wrap;
        }
        .card {
          background: var(--card);
          border-radius: 14px;
          padding: 19px;
          box-shadow: var(--glass-shadow);
          margin-bottom: 23px;
        }
        .period-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 13px;
        }
        .period-card {
          border-radius: 11px;
          padding: 13px;
          cursor: pointer;
          transition: transform .18s, box-shadow .18s, border-color .18s;
          border: 1px solid rgba(99,99,99,0.08);
          background: #fff;
        }
        .period-card:hover { transform: translateY(-3px); box-shadow: 0 8px 26px rgba(27,31,40,0.07); }
        .period-card.selected { border: 2px solid var(--accent); background: rgba(142,68,173,0.058); }
        .period-meta { font-size: 13px; color: var(--muted); margin-top:4px; }
        .period-title { font-weight:600; color: #222; font-size:1.12rem; }
        .btn-compact {
          padding: 8px 13px;
          border-radius: 8px;
          font-weight:600;
          font-size:1rem;
        }
        .attendance-actions { display:flex; gap:8px; flex-wrap:wrap; align-items:center; margin-bottom:12px; }
        .stats-pill { padding:8px 12px; border-radius:999px; font-weight:700; color:#fff; }
        .stats-pill.present { background: #2e7d32; }
        .stats-pill.absent { background: #c62828; }
        .table-responsive-custom {
          width:100%;
          overflow:auto;
          border-radius: 10px;
        }
        table.att-table {
          width:100%;
          border-collapse:collapse;
          min-width:700px;
        }
        table.att-table thead th {
          background: linear-gradient(90deg, rgba(91,44,111,0.95), rgba(142,68,173,0.95));
          color:#fff;
          padding:12px;
          text-align:left;
          position:sticky;
          top:0;
          z-index:2;
        }
        table.att-table td, table.att-table th {
          border-bottom: 1px solid #f1f1f1;
          padding:10px 12px;
          vertical-align: middle;
        }
        .status-btn {
          padding:6px 8px;
          border-radius:6px;
          font-weight:700;
          border:none;
          min-width:34px;
        }
        .status-btn.present { background:#2e7d32; color:#fff; }
        .status-btn.absent { background:#c62828; color:#fff; }
        .status-btn.late { background:#ffb300; color:#222; }
        .status-btn.excused { background:#6c757d; color:#fff; }
        @media (max-width: 1100px) {
          main.att-main { padding:18px;}
          .title{ font-size: 2rem; }
          .subtitle{ font-size:1.02rem;}
          .card{padding:11px;}
        }
        @media (max-width: 900px) {
          main.att-main { padding:7px;}
          .title{ font-size: 1.38rem;}
          .date-row-center{margin-bottom:13px;}
          .card{padding:6px;}
          .subtitle{ font-size:0.98rem;}
        }
        @media (max-width: 650px) {
          main.att-main{padding:3px;}
          .card{padding:4px;}
          .date-row-center{margin-bottom:7px;}
          .period-title{font-size:.94rem;}
          .title{font-size:1rem;}
          .subtitle{font-size:0.80rem;}
        }
      `}</style>
      <div className="take-attendance-page">
        <Sidebar onToggle={setSidebarOpen} />
        <main
          className="att-main"
          style={{ marginLeft: sidebarOpen ? "250px" : "80px" }}
          aria-live="polite"
        >
          {loadingFull && (
            <div className="main-loading-overlay">
              <div className="main-skeleton-box"></div>
            </div>
          )}
          <div className="header">
            <div>
              <h1 className="title">Take Attendance</h1>
              <div className="subtitle">
                Select a period below (today's timetable) and mark attendance for the students.
              </div>
            </div>
          </div>
          {/* Date input is centered below the heading */}
          <div className="date-row-center">
            <label style={{ display: "flex", gap: 8, alignItems: "center", fontWeight: 600 }}>
              Date
              <input
                type="date"
                className="form-control"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{ fontSize: "1.05rem", minWidth:130, maxWidth:180 }}
              />
            </label>
            <button
              className="btn btn-outline-secondary btn-compact"
              onClick={fetchTeacherTimetable}
              title="Reload timetable"
            >
              Refresh Timetable
            </button>
          </div>
          <div className="card">
            <h5 style={{ marginTop: 0 }}>Today's Periods</h5>
            {isLoadingTimetable ? (
              <div style={{ padding: 18 }}>Loading timetable...</div>
            ) : (
              <>
                <div className="period-grid" role="list" aria-label="Today periods">
                  {getCurrentDayTimetable().length === 0 && (
                    <div style={{ padding: 18, color: "#666" }}>No classes scheduled for today.</div>
                  )}
                  {getCurrentDayTimetable().map((tt) => {
                    const isSelected = selectedTimetable?._id === tt._id;
                    return (
                      <div
                        key={tt._id}
                        role="listitem"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === "Enter" && handleTimetableSelect(tt)}
                        className={`period-card ${isSelected ? "selected" : ""}`}
                        onClick={() => handleTimetableSelect(tt)}
                        style={{
                          borderColor: isSelected ? "var(--accent)" : undefined,
                          background: isSelected ? "rgba(142,68,173,0.08)" : undefined,
                        }}
                        aria-pressed={isSelected}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                          <div>
                            <div className="period-title">Period {tt.periodNumber}</div>
                            <div className="period-meta">
                              {tt.startTime} - {tt.endTime}
                            </div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontWeight: 700 }}>{tt.subject?.subjectName || "No Subject"}</div>
                            <div style={{ fontSize: 13, color: "var(--muted)" }}>
                              {tt.batch?.batchName} — Sec {tt.section}
                            </div>
                          </div>
                        </div>
                        <div style={{ marginTop: 8, display: "flex", gap: 6, justifyContent: "flex-start", alignItems: "center" }}>
                          <div style={{ fontSize: 12, color: "var(--muted)" }}>
                            Room: {tt.roomNumber || "N/A"}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
          {/* Students & Attendance area */}
          {selectedTimetable && (
            <div className="card" aria-live="polite">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, marginBottom: 12 }}>
                <div>
                  <h5 style={{ margin: 0 }}>{selectedTimetable.subject?.subjectName || "Subject"}</h5>
                  <div style={{ color: "var(--muted)", fontSize: 13 }}>
                    {selectedTimetable.batch?.batchName} — Section {selectedTimetable.section}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <div className="stats-pill present">Present: {presentCount}</div>
                  <div className="stats-pill absent">Absent: {absentCount}</div>
                  <button className="btn btn-outline-success btn-compact" onClick={markAllPresent}>Mark All Present</button>
                  <button className="btn btn-outline-danger btn-compact" onClick={markAllAbsent}>Mark All Absent</button>
                </div>
              </div>
              {isLoading ? (
                <div style={{ padding: 20 }}>Loading students...</div>
              ) : error ? (
                <div style={{ padding: 12, color: "#c62828" }}>{error}</div>
              ) : students.length === 0 ? (
                <div style={{ padding: 12, color: "#666" }}>No students loaded for the selected period.</div>
              ) : (
                <>
                  <form onSubmit={handleSubmit}>
                    <div className="attendance-actions">
                      <div style={{ color: "var(--muted)" }}>{students.length} students</div>
                      <div style={{ marginLeft: "auto" }}>
                        <button
                          type="submit"
                          className="btn btn-primary btn-compact"
                          
                        >
                          {isLoading ? "Submitting..." : "Submit Attendance"}
                        </button>
                      </div>
                    </div>
                    <div className="table-responsive-custom">
                      <table className="att-table">
                        <thead>
                          <tr>
                            <th style={{ width: 70 }}>S.No</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th style={{ width: 220, textAlign: "center" }}>Status</th>
                            <th>Remarks</th>
                          </tr>
                        </thead>
                        <tbody>
                          {students.map((student, idx) => {
                            const record = attendanceRecords.find((r) => r.student === student._id) || {};
                            return (
                              <tr key={student._id || idx}>
                                <td style={{ fontWeight: 700 }}>{idx + 1}</td>
                                <td>{student.name}</td>
                                <td style={{ color: "var(--muted)" }}>{student.email}</td>
                                <td style={{ textAlign: "center" }}>
                                  <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>
                                    {["Present", "Absent", "Late", "Excused"].map((s) => {
                                      const cls = s.toLowerCase();
                                      const active = record.status === s;
                                      const baseClass = `status-btn ${cls}`;
                                      return (
                                        <button
                                          key={s}
                                          type="button"
                                          title={s}
                                          onClick={() => handleStatusChange(student._id, s)}
                                          className={baseClass}
                                          style={{
                                            opacity: active ? 1 : 0.83,
                                            transform: active ? "scale(1.05)" : "none",
                                          }}
                                        >
                                          {s === "Present" ? "P" : s === "Absent" ? "A" : s === "Late" ? "L" : "E"}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    value={record?.remarks || ""}
                                    onChange={(e) => handleRemarksChange(student._id, e.target.value)}
                                    placeholder="Optional remarks"
                                    className="form-control"
                                    style={{ fontSize: "1rem" }}
                                  />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </form>
                </>
              )}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default TakeAttendance;
