// src/pages/AttendanceReport.jsx
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import {
  fetchBatchesByDepartmentId,
  fetchSubjectsByDepartmentId,
  fetchAttendanceReport,
  fetchDepartment,
} from "../services/attendanceService";
import { 
  Users, 
  Filter, 
  Search, 
  Download, 
  Printer, 
  RefreshCw, 
  Calendar, 
  TrendingUp, 
  FileText,
  CheckCircle2,
  AlertCircle,
  XCircle
} from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

const AttendanceReport = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [batches, setBatches] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [reportData, setReportData] = useState([]);

  const [filters, setFilters] = useState({
    department: "",
    batch: "",
    section: "A",
    subject: "",
    startDate: "",
    endDate: "",
  });

  const [loadingReport, setLoadingReport] = useState(false);
  const [searchQ, setSearchQ] = useState("");

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await fetchDepartment();
      if (res?.success) {
        setDepartments(res.data || []);
      } else if (Array.isArray(res)) {
        setDepartments(res);
      }
    } catch (err) {
      console.error("fetchDepartment error:", err);
    }
  };

  const handleDepartmentChange = async (departmentId) => {
    setFilters((p) => ({
      ...p,
      department: departmentId,
      batch: "",
      subject: "",
    }));
    setBatches([]);
    setSubjects([]);
    setReportData([]);
    if (!departmentId) return;

    try {
      const [bResp, sResp] = await Promise.allSettled([
        fetchBatchesByDepartmentId(departmentId),
        fetchSubjectsByDepartmentId(departmentId),
      ]);
      
      if (bResp.status === "fulfilled") {
        const val = bResp.value;
        if (val?.success) setBatches(val.data || []);
        else if (Array.isArray(val)) setBatches(val);
      }
      
      if (sResp.status === "fulfilled") {
        const val = sResp.value;
        if (val?.success) setSubjects(val.data || []);
        else if (Array.isArray(val)) setSubjects(val);
      }
    } catch (err) {
      console.error("Error loading batches/subjects:", err);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((p) => ({ ...p, [key]: value }));
  };

  const fetchReport = async () => {
    if (!filters.batch || !filters.section) {
      alert("Please select batch and section");
      return;
    }
    setLoadingReport(true);
    setReportData([]);
    try {
      const res = await fetchAttendanceReport(filters);
      if (res?.success) {
        setReportData(res.data || []);
      } else if (Array.isArray(res)) {
        setReportData(res);
      } else {
        setReportData([]);
      }
    } catch (err) {
      console.error("fetchAttendanceReport error:", err);
      alert("Failed to fetch attendance report");
    } finally {
      setLoadingReport(false);
    }
  };

  const exportToCSV = () => {
    if (!reportData.length) {
      alert("No data to export");
      return;
    }
    const headers = [
      "Student Name", "Email", "Total Classes", "Present", "Absent", 
      "Late", "Excused", "Attendance %"
    ];
    const rows = reportData.map((r) => [
      r.student?.name || "-", r.student?.email || "-", r.total ?? 0,
      r.present ?? 0, r.absent ?? 0, r.late ?? 0, r.excused ?? 0,
      r.attendancePercentage ?? 0,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance_report_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getAttendanceColor = (percentage) => {
    const p = Number(percentage);
    if (isNaN(p)) return "#6c757d";
    if (p >= 75) return "#10b981";
    if (p >= 60) return "#f59e0b";
    return "#ef4444";
  };

  const printReport = () => {
    if (!reportData.length) {
      alert("No data to print");
      return;
    }
    const rows = reportData.map((r, idx) => `
      <tr>
        <td style="padding:8px">${idx + 1}</td>
        <td style="padding:8px">${r.student?.name || "-"}</td>
        <td style="padding:8px">${r.student?.email || "-"}</td>
        <td style="padding:8px;text-align:center">${r.total ?? 0}</td>
        <td style="padding:8px;text-align:center">${r.present ?? 0}</td>
        <td style="padding:8px;text-align:center">${r.absent ?? 0}</td>
        <td style="padding:8px;text-align:center">${r.late ?? 0}</td>
        <td style="padding:8px;text-align:center">${r.excused ?? 0}</td>
        <td style="padding:8px;text-align:center">${r.attendancePercentage ?? 0}%</td>
      </tr>
    `).join("");

    const header = `
      <div style="font-family: Arial, sans-serif; padding:20px; max-width:1000px; margin:0 auto;">
        <h2 style="color:#8b6fe6; margin:0 0 8px 0;">Attendance Report</h2>
        <p style="margin:0 0 10px 0; color:#64748b;">
          ${departments.find((d) => d._id === filters.department)?.departmentName || ""} • 
          ${batches.find((b) => b._id === filters.batch)?.batchName || ""} • Section ${filters.section}
        </p>
        <table style="width:100%;border-collapse:collapse;margin-top:12px;">
          <thead>
            <tr style="background: linear-gradient(135deg,#ad8ff8,#8b6fe6); color:white;">
              <th style="padding:12px;">S.No</th><th style="padding:12px;">Name</th>
              <th style="padding:12px;">Email</th><th style="padding:12px;">Total</th>
              <th style="padding:12px;">Present</th><th style="padding:12px;">Absent</th>
              <th style="padding:12px;">Late</th><th style="padding:12px;">Excused</th>
              <th style="padding:12px;">%</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
        <p style="margin-top:16px;color:#64748b;font-size:14px">
          Generated: ${new Date().toLocaleString()}
        </p>
      </div>
    `;
    const w = window.open("", "_blank", "width=1000,height=800");
    if (w) {
      w.document.write(`<html><head><title>Attendance Report</title></head><body>${header}</body></html>`);
      w.document.close();
      w.focus();
      setTimeout(() => w.print(), 400);
    }
  };

  const filtered = reportData.filter((r) => {
    if (!searchQ) return true;
    const q = searchQ.toLowerCase();
    return (
      (r.student?.name || "").toLowerCase().includes(q) ||
      (r.student?.email || "").toLowerCase().includes(q)
    );
  });

  return (
    <>
      <style>{`
        :root {
          --primary: #ad8ff8;
          --primary-dark: #8b6fe6;
          --soft: #f5f1ff;
          --text: #1e293b;
          --muted: #64748b;
          --success: #10b981;
          --warning: #f59e0b;
          --danger: #ef4444;
        }

        * {
          box-sizing: border-box;
        }

        body {
          background: linear-gradient(135deg, #f7f4ff 0%, #eef2ff 100%);
          margin: 0;
          font-family: 'Inter', 'Poppins', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .admin-layout {
          display: flex;
          min-height: 100vh;
          overflow: hidden;
        }

        .main-content {
          flex: 1;
          padding: clamp(16px, 3vw, 32px);
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          overflow-y: auto;
          background: linear-gradient(135deg, #f7f4ff 0%, #eef2ff 100%);
        }

        .page-title {
          font-size: clamp(22px, 4vw, 32px);
          font-weight: 600;
          background: linear-gradient(135deg, var(--primary-dark), var(--primary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 0 4px 0;
          line-height: 1.2;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .page-subtitle {
          color: var(--muted);
          font-size: clamp(13px, 2vw, 15px);
          margin: 0;
          font-weight: 400;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .card-ui {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: clamp(20px, 3vw, 28px);
          box-shadow: 
            0 20px 40px rgba(0,0,0,0.08),
            0 1px 3px rgba(0,0,0,0.1),
            inset 0 1px 0 rgba(255,255,255,0.9);
          margin-bottom: 24px;
          border: 1px solid rgba(255,255,255,0.2);
          transition: all 0.3s ease;
        }

        .card-ui:hover {
          transform: translateY(-2px);
          box-shadow: 
            0 25px 50px rgba(0,0,0,0.12),
            0 1px 3px rgba(0,0,0,0.1);
        }

        .btn-main, .btn-success, .btn-secondary-soft {
          border: none;
          border-radius: 14px;
          padding: 12px 24px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-height: 48px;
        }

        .btn-main {
          background: linear-gradient(135deg, var(--primary-dark), var(--primary));
          color: #fff;
          box-shadow: 0 8px 24px rgba(139, 111, 230, 0.4);
        }

        .btn-main:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(139, 111, 230, 0.6);
        }

        .btn-success {
          background: linear-gradient(135deg, var(--success), #059669);
          color: #fff;
          box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4);
        }

        .btn-success:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(16, 185, 129, 0.6);
        }

        .btn-secondary-soft {
          background: linear-gradient(135deg, #6c757d, #5a6268);
          color: #fff;
          box-shadow: 0 8px 24px rgba(108, 117, 125, 0.4);
        }

        .btn-secondary-soft:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(108, 117, 125, 0.6);
        }

        .btn-main:disabled, .btn-success:disabled, .btn-secondary-soft:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px;
          margin-bottom: 20px;
        }

        .form-label-strong {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          font-weight: 600;
          font-size: 14px;
          color: var(--text);
          line-height: 1.4;
        }

        .form-control, .form-select {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 14px;
          transition: all 0.3s ease;
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(10px);
        }

        .form-control:focus, .form-select:focus {
          outline: none;
          border-color: var(--primary-dark);
          box-shadow: 0 0 0 3px rgba(139, 111, 230, 0.1);
          transform: translateY(-1px);
        }

        .table-wrapper {
          max-height: 520px;
          overflow-y: auto;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.08);
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(20px);
          margin-bottom: 20px;
        }

        .table {
          margin: 0;
          width: 100%;
          background: transparent;
        }

        .table thead th {
          position: sticky;
          top: 0;
          z-index: 10;
          background: linear-gradient(135deg, var(--primary-dark), var(--primary));
          color: white;
          font-weight: 700;
          padding: 16px 12px;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border: none;
          white-space: nowrap;
        }

        .table tbody td {
          padding: 16px 12px;
          border-color: rgba(226, 232, 240, 0.5);
          vertical-align: middle;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .table tbody tr {
          transition: all 0.2s ease;
        }

        .table tbody tr:hover {
          background: rgba(173, 143, 248, 0.08);
          transform: scale(1.01);
        }

        .table tbody tr:nth-child(even) {
          background: rgba(248, 250, 252, 0.6);
        }

        .status-pill {
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 700;
          color: #fff;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          min-width: 80px;
          text-align: center;
        }

        .legend-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 16px;
          margin-top: 20px;
          padding: 20px;
          background: rgba(248, 250, 252, 0.5);
          border-radius: 16px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
          font-weight: 500;
          color: var(--text);
        }

        .input-group {
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(0,0,0,0.08);
          transition: all 0.3s ease;
        }

        .input-group:hover {
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
        }

        .input-group-text {
          background: linear-gradient(135deg, var(--primary-dark), var(--primary));
          color: white;
          border: none;
          padding: 12px 16px;
          font-size: 16px;
        }

        .icon { 
          width: 20px; 
          height: 20px; 
          flex-shrink: 0;
          stroke-width: 2;
        }

        .icon-sm { width: 16px; height: 16px; }
        .icon-lg { width: 24px; height: 24px; }

        @media (max-width: 992px) {
          .form-grid { grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; }
        }

        @media (max-width: 768px) {
          .main-content { padding: 16px 12px; margin-left: 0 !important; }
          .page-title { text-align: center; flex-direction: column; gap: 8px; }
          .form-grid { grid-template-columns: 1fr; gap: 14px; }
          .card-ui { padding: 16px; margin-bottom: 20px; }
          .table-wrapper { max-height: 400px; }
          .table thead th, .table tbody td { padding: 12px 8px; font-size: 13px; }
          .legend-grid { grid-template-columns: 1fr; gap: 12px; padding: 16px; }
        }

        @media (max-width: 480px) {
          .main-content { padding: 12px 8px; }
          .card-ui { padding: 14px; border-radius: 16px; }
          .btn-main, .btn-success, .btn-secondary-soft { 
            padding: 12px 20px; 
            font-size: 14px; 
            width: 100%; 
            justify-content: center; 
          }
          .table thead th { font-size: 12px; padding: 10px 6px; }
          .table tbody td { font-size: 13px; padding: 10px 6px; }
        }

        .table-wrapper::-webkit-scrollbar { width: 8px; }
        .table-wrapper::-webkit-scrollbar-track { background: rgba(226, 232, 240, 0.5); border-radius: 4px; }
        .table-wrapper::-webkit-scrollbar-thumb { background: var(--primary-dark); border-radius: 4px; }
        .table-wrapper::-webkit-scrollbar-thumb:hover { background: var(--primary); }
      `}</style>

      <div className="admin-layout">
        <Sidebar onToggle={setSidebarOpen} />
        <main className="main-content" style={{ marginLeft: sidebarOpen ? "250px" : "80px" }}>
          
          {/* HEADER */}
          <header className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
            <div>
              <h1 className="page-title">
                <FileText className="icon" />
                Attendance Report
              </h1>
              <p className="page-subtitle">
                <TrendingUp className="icon-sm" />
                Generate detailed attendance summaries by department, batch & section
              </p>
            </div>
            <button
              className="btn-secondary-soft"
              onClick={() => {
                setFilters({
                  department: "", batch: "", section: "A", subject: "", startDate: "", endDate: ""
                });
                setBatches([]);
                setSubjects([]);
                setReportData([]);
                setSearchQ("");
              }}
            >
              <RefreshCw className="icon-sm" />
              Reset All Filters
            </button>
          </header>

          {/* FILTERS SECTION */}
          <section className="card-ui">
            <h5 style={{ margin: "0 0 20px 0", fontWeight: "700", color: "var(--text)", display: "flex", alignItems: "center", gap: "12px" }}>
              <Filter className="icon" />
              Filters
            </h5>
            <div className="form-grid">
              <div>
                <label className="form-label-strong">
                  <Users className="icon-sm" />
                  Department <span style={{color: "#ef4444"}}>*</span>
                </label>
                <select
                  className="form-select form-control"
                  value={filters.department}
                  onChange={(e) => handleDepartmentChange(e.target.value)}
                >
                  <option value="">Select Department</option>
                  {departments.map((d) => (
                    <option key={d._id} value={d._id}>{d.departmentName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label-strong">
                  <Users className="icon-sm" />
                  Batch <span style={{color: "#ef4444"}}>*</span>
                </label>
                <select
                  className="form-select form-control"
                  value={filters.batch}
                  onChange={(e) => handleFilterChange("batch", e.target.value)}
                  disabled={!filters.department || !batches.length}
                >
                  <option value="">
                    {filters.department ? "Select Batch" : "Select Department First"}
                  </option>
                  {batches.map((b) => (
                    <option key={b._id} value={b._id}>{b.batchName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label-strong">
                  <Users className="icon-sm" />
                  Section <span style={{color: "#ef4444"}}>*</span>
                </label>
                <select
                  className="form-select form-control"
                  value={filters.section}
                  onChange={(e) => handleFilterChange("section", e.target.value)}
                >
                  <option value="A">Section A</option>
                  <option value="B">Section B</option>
                  <option value="C">Section C</option>
                  <option value="D">Section D</option>
                </select>
              </div>

              <div>
                <label className="form-label-strong">
                  <FileText className="icon-sm" />
                  Subject (Optional)
                </label>
                <select
                  className="form-select form-control"
                  value={filters.subject}
                  onChange={(e) => handleFilterChange("subject", e.target.value)}
                  disabled={!filters.department || !subjects.length}
                >
                  <option value="">All Subjects</option>
                  {subjects.map((s) => (
                    <option key={s._id} value={s._id}>{s.subjectName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label-strong">
                  <Calendar className="icon-sm" />
                  Start Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange("startDate", e.target.value)}
                />
              </div>

              <div>
                <label className="form-label-strong">
                  <Calendar className="icon-sm" />
                  End Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange("endDate", e.target.value)}
                />
              </div>

              <div style={{ alignSelf: "end", gridColumn: "1 / -1" }}>
                <button
                  className="btn-main"
                  onClick={fetchReport}
                  disabled={loadingReport || !filters.batch || !filters.section}
                  style={{ width: "100%" }}
                >
                  {loadingReport ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" />
                      Generating Report...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="icon-sm" />
                      Generate Report
                    </>
                  )}
                </button>
              </div>
            </div>
            
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button
                className="btn-secondary-soft"
                onClick={() => {
                  handleFilterChange("startDate", "");
                  handleFilterChange("endDate", "");
                }}
                style={{ padding: "10px 20px" }}
              >
                <Calendar className="icon-sm" />
                Clear Dates
              </button>
            </div>
          </section>

          {/* SEARCH & ACTIONS */}
          {reportData.length > 0 && (
            <section className="card-ui">
              <div className="d-flex flex-column flex-lg-row justify-content-between align-items-stretch align-items-lg-center gap-3">
                <div className="input-group" style={{ maxWidth: "500px", width: "100%" }}>
                  <span className="input-group-text">
                    <Search className="icon-sm" />
                  </span>
                  <input
                    className="form-control"
                    placeholder={`Search ${filtered.length} students by name or email...`}
                    value={searchQ}
                    onChange={(e) => setSearchQ(e.target.value)}
                  />
                </div>
                <div className="d-flex gap-2 flex-wrap">
                  <button className="btn-success" onClick={exportToCSV}>
                    <Download className="icon-sm" />
                    Export CSV
                  </button>
                  <button className="btn-main" onClick={printReport}>
                    <Printer className="icon-sm" />
                    Print Report
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* REPORT TABLE */}
          <section className="card-ui">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
              <h5 style={{ margin: 0, fontWeight: "700", color: "var(--text)", display: "flex", alignItems: "center", gap: "12px" }}>
                <TrendingUp className="icon-lg" />
                Attendance Summary 
                <span style={{ color: "var(--primary-dark)", fontSize: "0.9em" }}>
                  ({filtered.length} of {reportData.length})
                </span>
              </h5>
            </div>
            
            <div className="table-wrapper">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th style={{ width: "60px", minWidth: "60px" }}>#</th>
                    <th style={{ minWidth: "160px" }}>Student Name</th>
                    <th style={{ minWidth: "200px" }}>Email</th>
                    <th className="text-center" style={{ width: "90px" }}>Total</th>
                    <th className="text-center" style={{ width: "90px" }}>Present</th>
                    <th className="text-center" style={{ width: "90px" }}>Absent</th>
                    <th className="text-center" style={{ width: "90px" }}>Late</th>
                    <th className="text-center" style={{ width: "90px" }}>Excused</th>
                    <th className="text-center" style={{ width: "120px" }}>Attendance %</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingReport ? (
                    <tr>
                      <td colSpan={9} className="text-center py-5">
                        <div className="spinner-border text-primary mb-3" style={{ width: "3rem", height: "3rem" }} />
                        <div className="text-muted fw-semibold">Generating detailed report...</div>
                      </td>
                    </tr>
                  ) : filtered.length > 0 ? (
                    filtered.map((r, idx) => (
                      <tr key={r.student?._id || `row-${idx}`}>
                        <td className="fw-bold text-muted" style={{ fontSize: "15px" }}>
                          {idx + 1}
                        </td>
                        <td>
                          <strong style={{ color: "var(--text)", fontSize: "15px" }}>
                            {r.student?.name || "N/A"}
                          </strong>
                        </td>
                        <td style={{ fontSize: "14px", color: "#64748b" }}>
                          {r.student?.email || "N/A"}
                        </td>
                        <td className="text-center fw-semibold fs-6">{r.total ?? 0}</td>
                        <td className="text-center fw-bold fs-6" style={{ color: "var(--success)" }}>
                          {r.present ?? 0}
                        </td>
                        <td className="text-center fw-bold fs-6" style={{ color: "var(--danger)" }}>
                          {r.absent ?? 0}
                        </td>
                        <td className="text-center fw-bold fs-6" style={{ color: "var(--warning)" }}>
                          {r.late ?? 0}
                        </td>
                        <td className="text-center fw-bold fs-6" style={{ color: "#06b6d4" }}>
                          {r.excused ?? 0}
                        </td>
                        <td className="text-center">
                          <span 
                            className="status-pill" 
                            style={{
                              backgroundColor: getAttendanceColor(r.attendancePercentage),
                              fontSize: "14px",
                              padding: "8px 16px",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                            }}
                          >
                            {r.attendancePercentage?.toFixed(1) ?? 0}%
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="text-center py-5">
                        <div className="text-muted" style={{ fontSize: "16px" }}>
                          {reportData.length === 0
                            ? "👆 No report yet. Use filters above and click Generate Report"
                            : "🔍 No matching results found"
                          }
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* LEGEND */}
            {reportData.length > 0 && (
              <div className="legend-grid">
                <div className="legend-item">
                  <CheckCircle2 className="icon-sm" style={{ color: "var(--success)" }} />
                  <span>✅ ≥ 75% (Good)</span>
                </div>
                <div className="legend-item">
                  <AlertCircle className="icon-sm" style={{ color: "var(--warning)" }} />
                  <span>⚠️ 60–74% (Warning)</span>
                </div>
                <div className="legend-item">
                  <XCircle className="icon-sm" style={{ color: "var(--danger)" }} />
                  <span>❌ &lt; 60% (Low)</span>
                </div>
              </div>
            )}
          </section>
        </main>
      </div>
    </>
  );
};

export default AttendanceReport;
