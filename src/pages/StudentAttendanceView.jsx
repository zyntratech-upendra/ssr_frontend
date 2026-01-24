// src/pages/StudentAttendanceView.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  fetchStudentInformation,
  fetchStudentAttendance,
} from "../services/attendanceService.jsx";

const StudentAttendanceView = ({ studentId: propStudentId }) => {
  const [studentId, setStudentId] = useState(propStudentId);
  const [studentInfo, setStudentInfo] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("date");
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: new Date().toISOString().split("T")[0],
  });
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    // If no studentId prop, get from localStorage
    let finalStudentId = propStudentId;
    if (!finalStudentId) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      finalStudentId = user._id || user.id;
    }
    
    setStudentId(finalStudentId);
    
    if (finalStudentId) {
      fetchStudentInfo(finalStudentId);
      fetchAttendance(finalStudentId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propStudentId]);

  const fetchStudentInfo = async (id = studentId) => {
    try {
      const response = await fetchStudentInformation(id);
      const data = response;

      if (data.success) {
        setStudentInfo(data.data);
      }
    } catch (error) {
      console.error("Error fetching student info:", error);
    }
  };

  const fetchAttendance = async (id = studentId) => {
    setLoading(true);
    try {
      const data = await fetchStudentAttendance(id, {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });
      console.log('Attendance data received:', data);
      if (data.success) {
        const attendanceRecords = data.data || [];
        console.log('Setting attendance records:', attendanceRecords);
        setAttendance(attendanceRecords);
        const uniqueSubjects = [
          ...new Set(attendanceRecords?.map((att) => att.subject?.subjectName)),
        ].filter(Boolean);
        console.log('Unique subjects:', uniqueSubjects);
        setSubjects(uniqueSubjects);
      }
    } catch (err) {
      console.error("Error fetching attendance:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange({
      ...dateRange,
      [name]: value,
    });
  };

  const handleApplyFilter = () => {
    fetchAttendance();
  };

  const getAttendanceStats = () => {
    return {
      total: attendance.length,
      present: attendance.filter((a) => a.status === "Present").length,
      absent: attendance.filter((a) => a.status === "Absent").length,
      late: attendance.filter((a) => a.status === "Late").length,
      excused: attendance.filter((a) => a.status === "Excused").length,
    };
  };

  const getAttendancePercentage = () => {
    const stats = getAttendanceStats();
    if (stats.total === 0) return 0;
    return ((stats.present / stats.total) * 100).toFixed(2);
  };

  const groupByDate = () => {
    const grouped = {};
    attendance.forEach((att) => {
      const date = new Date(att.date).toLocaleDateString("en-IN", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(att);
    });
    return grouped;
  };

  const groupBySubject = () => {
    const grouped = {};
    attendance.forEach((att) => {
      const subjectName = att.subject?.subjectName || "Unknown Subject";
      if (!grouped[subjectName]) grouped[subjectName] = [];
      grouped[subjectName].push(att);
    });
    return grouped;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Present":
        return { bg: "#d4edda", text: "#155724", border: "#c3e6cb" };
      case "Absent":
        return { bg: "#f8d7da", text: "#721c24", border: "#f5c6cb" };
      case "Late":
        return { bg: "#fff3cd", text: "#856404", border: "#ffeaa7" };
      case "Excused":
        return { bg: "#d1ecf1", text: "#0c5460", border: "#bee5eb" };
      default:
        return { bg: "#e2e3e5", text: "#383d41", border: "#d6d8db" };
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Present":
        return "✓";
      case "Absent":
        return "✗";
      case "Late":
        return "⏱";
      case "Excused":
        return "ⓘ";
      default:
        return "?";
    }
  };

  const stats = getAttendanceStats();
  const percentage = getAttendancePercentage();
  const groupedByDate = groupByDate();
  const groupedBySubject = groupBySubject();

  const filteredAttendance = selectedSubject
    ? attendance.filter((att) => att.subject?.subjectName === selectedSubject)
    : attendance;

  const displayData =
    viewMode === "date"
      ? groupByDate()
      : selectedSubject
      ? { [selectedSubject]: filteredAttendance }
      : groupedBySubject;

  return (
    <>
      <style>{`
        :root {
          --primary: #2563eb;
          --muted: #6b7280;
          --card-bg: #ffffff;
        }

        .student-page {
          display: flex;
          min-height: 100vh;
          background: radial-gradient(circle at top left,#eff6ff,#e0f2fe);
        }

        .main-content {
          flex: 1;
          padding: 24px 32px;
          transition: margin-left .32s ease;
        }

        .page-title {
          font-size: 28px;
          font-weight: 800;
          color: #111827;
          margin-bottom: 6px;
        }

        .page-subtitle {
          color: var(--muted);
          font-size: 14px;
        }

        @media (max-width: 992px) {
          .main-content { padding: 20px 16px; }
        }
        @media (max-width: 768px) {
          .main-content { padding: 16px 10px; }
          .page-title { font-size: 22px; text-align: center; }
          .page-subtitle { text-align: center; }
        }
        @media (max-width: 480px) {
          .main-content { padding: 10px 6px; }
        }
      `}</style>

      <div className="student-page">
        <Sidebar onToggle={setSidebarOpen} />

        <main
          className="main-content"
          style={{ marginLeft: sidebarOpen ? "250px" : "80px" }}
        >
          {/* HEADER */}
          <div className="mb-3">
            <h1 className="page-title">My Attendance</h1>
            <p className="page-subtitle mb-0">
              View your daily and subject-wise attendance details.
            </p>
          </div>

          {studentInfo && (
            <div
              style={{
                backgroundColor: "#e3f2fd",
                padding: "15px",
                borderRadius: "8px",
                marginBottom: "20px",
                borderLeft: "4px solid #007bff",
              }}
            >
              <h3 style={{ margin: "0 0 10px 0" }}>Student Information</h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "10px",
                }}
              >
                <div>
                  <span style={{ fontWeight: "bold" }}>Name:</span>{" "}
                  {studentInfo.name}
                </div>
                <div>
                  <span style={{ fontWeight: "bold" }}>Email:</span>{" "}
                  {studentInfo.email}
                </div>
                <div>
                  <span style={{ fontWeight: "bold" }}>
                    Roll Section:
                  </span>{" "}
                  {studentInfo.section || "N/A"}
                </div>
                <div>
                  <span style={{ fontWeight: "bold" }}>
                    Department:
                  </span>{" "}
                  {studentInfo.department?.departmentName || "N/A"}
                </div>
              </div>
            </div>
          )}

          {/* SUMMARY CARDS */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "15px",
              marginBottom: "30px",
            }}
          >
            <div
              style={{
                backgroundColor: "#d4edda",
                padding: "15px",
                borderRadius: "8px",
                textAlign: "center",
                borderLeft: "4px solid #28a745",
              }}
            >
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#155724",
                }}
              >
                {stats.present}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#155724",
                  marginTop: "5px",
                }}
              >
                Present
              </div>
            </div>

            <div
              style={{
                backgroundColor: "#f8d7da",
                padding: "15px",
                borderRadius: "8px",
                textAlign: "center",
                borderLeft: "4px solid #dc3545",
              }}
            >
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#721c24",
                }}
              >
                {stats.absent}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#721c24",
                  marginTop: "5px",
                }}
              >
                Absent
              </div>
            </div>

            <div
              style={{
                backgroundColor: "#fff3cd",
                padding: "15px",
                borderRadius: "8px",
                textAlign: "center",
                borderLeft: "4px solid #ffc107",
              }}
            >
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#856404",
                }}
              >
                {stats.late}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#856404",
                  marginTop: "5px",
                }}
              >
                Late
              </div>
            </div>

            <div
              style={{
                backgroundColor: "#d1ecf1",
                padding: "15px",
                borderRadius: "8px",
                textAlign: "center",
                borderLeft: "4px solid #17a2b8",
              }}
            >
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#0c5460",
                }}
              >
                {stats.excused}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#0c5460",
                  marginTop: "5px",
                }}
              >
                Excused
              </div>
            </div>

            <div
              style={{
                backgroundColor: "#e8f5e9",
                padding: "15px",
                borderRadius: "8px",
                textAlign: "center",
                borderLeft: "4px solid #4caf50",
              }}
            >
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#2e7d32",
                }}
              >
                {stats.total}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#2e7d32",
                  marginTop: "5px",
                }}
              >
                Total Classes
              </div>
            </div>

            <div
              style={{
                backgroundColor:
                  percentage >= 75
                    ? "#c8e6c9"
                    : percentage >= 60
                    ? "#fff9c4"
                    : "#ffccbc",
                padding: "15px",
                borderRadius: "8px",
                textAlign: "center",
                borderLeft: `4px solid ${
                  percentage >= 75
                    ? "#43a047"
                    : percentage >= 60
                    ? "#f9a825"
                    : "#e64a19"
                }`,
              }}
            >
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color:
                    percentage >= 75
                      ? "#2e7d32"
                      : percentage >= 60
                      ? "#f57f17"
                      : "#d84315",
                }}
              >
                {percentage}%
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color:
                    percentage >= 75
                      ? "#2e7d32"
                      : percentage >= 60
                      ? "#f57f17"
                      : "#d84315",
                  marginTop: "5px",
                }}
              >
                Attendance %
              </div>
            </div>
          </div>

          {/* FILTERS */}
          <div
            style={{
              backgroundColor: "#f9f9f9",
              padding: "20px",
              borderRadius: "8px",
              marginBottom: "30px",
            }}
          >
            <h2 style={{ marginBottom: "20px" }}>Filters</h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "15px",
                marginBottom: "20px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                  }}
                >
                  View By
                </label>
                <select
                  value={viewMode}
                  onChange={(e) => {
                    setViewMode(e.target.value);
                    setSelectedSubject("");
                  }}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    fontSize: "14px",
                  }}
                >
                  <option value="date">By Date</option>
                  <option value="subject">By Subject</option>
                </select>
              </div>

              {viewMode === "subject" && (
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "5px",
                      fontWeight: "bold",
                    }}
                  >
                    Filter by Subject
                  </label>
                  <select
                    value={selectedSubject}
                    onChange={(e) =>
                      setSelectedSubject(e.target.value)
                    }
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                      fontSize: "14px",
                    }}
                  >
                    <option value="">All Subjects</option>
                    {subjects.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                  }}
                >
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={dateRange.startDate}
                  onChange={handleDateRangeChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                  }}
                >
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={dateRange.endDate}
                  onChange={handleDateRangeChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            <button
              onClick={handleApplyFilter}
              disabled={loading}
              style={{
                padding: "10px 30px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: "16px",
                fontWeight: "bold",
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? "Loading..." : "Apply Filters"}
            </button>
          </div>

          {/* DETAILS */}
          {Object.keys(displayData).length > 0 ? (
            <div>
              <h2 style={{ marginBottom: "20px" }}>
                Attendance Details (
                {viewMode === "date" ? "By Date" : "By Subject"})
              </h2>

              {Object.entries(displayData).map(([key, records]) => {
                const keyStats = {
                  total: records.length,
                  present: records.filter(
                    (r) => r.status === "Present"
                  ).length,
                  absent: records.filter(
                    (r) => r.status === "Absent"
                  ).length,
                  late: records.filter(
                    (r) => r.status === "Late"
                  ).length,
                  excused: records.filter(
                    (r) => r.status === "Excused"
                  ).length,
                };
                const keyPercentage =
                  keyStats.total > 0
                    ? (
                        (keyStats.present / keyStats.total) *
                        100
                      ).toFixed(1)
                    : 0;

                return (
                  <div key={key} style={{ marginBottom: "25px" }}>
                    <div
                      style={{
                        backgroundColor: "#007bff",
                        color: "white",
                        padding: "12px 15px",
                        borderRadius: "6px 6px 0 0",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <h3 style={{ margin: 0 }}>{key}</h3>
                      <div
                        style={{
                          fontSize: "13px",
                          display: "flex",
                          gap: "15px",
                        }}
                      >
                        <span>P: {keyStats.present}</span>
                        <span>A: {keyStats.absent}</span>
                        <span>L: {keyStats.late}</span>
                        <span>E: {keyStats.excused}</span>
                        <span style={{ fontWeight: "bold" }}>
                          {keyPercentage}%
                        </span>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(300px, 1fr))",
                        gap: "12px",
                        padding: "15px",
                        backgroundColor: "#f9f9f9",
                        borderRadius: "0 0 6px 6px",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      {records.map((record, index) => {
                        const colors = getStatusColor(record.status);
                        return (
                          <div
                            key={index}
                            style={{
                              backgroundColor: colors.bg,
                              border: `1px solid ${colors.border}`,
                              borderRadius: "6px",
                              padding: "12px",
                              color: colors.text,
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "start",
                                marginBottom: "8px",
                              }}
                            >
                              <div>
                                <div
                                  style={{
                                    fontWeight: "bold",
                                    fontSize: "16px",
                                    marginBottom: "4px",
                                  }}
                                >
                                  {record.subject?.subjectName ||
                                    "Unknown Subject"}
                                </div>
                                <div
                                  style={{
                                    fontSize: "12px",
                                    opacity: 0.8,
                                  }}
                                >
                                  {record.subject?.subjectCode || "N/A"}
                                </div>
                              </div>
                              <div
                                style={{
                                  fontSize: "24px",
                                  fontWeight: "bold",
                                  opacity: 0.6,
                                }}
                              >
                                {getStatusIcon(record.status)}
                              </div>
                            </div>

                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: "8px",
                                fontSize: "12px",
                                marginBottom: "8px",
                              }}
                            >
                              <div>
                                <span style={{ opacity: 0.7 }}>
                                  Teacher:
                                </span>
                                <div
                                  style={{
                                    fontWeight: "500",
                                  }}
                                >
                                  {record.teacher?.name || "N/A"}
                                </div>
                              </div>
                              <div>
                                <span style={{ opacity: 0.7 }}>
                                  Period:
                                </span>
                                <div
                                  style={{
                                    fontWeight: "500",
                                  }}
                                >
                                  P{record.periodNumber}
                                </div>
                              </div>
                            </div>

                            <div
                              style={{
                                backgroundColor:
                                  "rgba(255,255,255,0.3)",
                                padding: "6px",
                                borderRadius: "4px",
                                fontSize: "12px",
                                marginBottom: "8px",
                                fontWeight: "500",
                              }}
                            >
                              Status: {record.status}
                            </div>

                            <div
                              style={{
                                fontSize: "11px",
                                opacity: 0.7,
                              }}
                            >
                              {new Date(
                                record.date
                              ).toLocaleDateString("en-IN")}
                              {record.remarks && (
                                <div>Note: {record.remarks}</div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                backgroundColor: "#f9f9f9",
                borderRadius: "8px",
                color: "#666",
              }}
            >
              {loading ? (
                <div>Loading your attendance records...</div>
              ) : (
                <div>
                  <div
                    style={{
                      fontSize: "48px",
                      marginBottom: "10px",
                    }}
                  >
                    📋
                  </div>
                  <div>
                    No attendance records found for the selected
                    period
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default StudentAttendanceView;
