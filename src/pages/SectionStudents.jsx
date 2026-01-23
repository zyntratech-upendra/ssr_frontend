import React, { useEffect, useState, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import { getAllDepartments } from "../services/departmentService";
import { fetchBatchesByDepartment } from "../services/teacherAllocationService.jsx";
import {
  fetchSectionsbyDepartementandBatchandYear,
  fetchStudentsbyBatchandSection,
} from "../services/sectionService.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import * as XLSX from "xlsx";

const SectionStudents = () => {
  const [departments, setDepartments] = useState([]);
  const [batches, setBatches] = useState([]);
  const [sections, setSections] = useState([]);
  const [students, setStudents] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [filters, setFilters] = useState({
    department: "",
    batch: "",
    section: "",
  });

  const [displayInfo, setDisplayInfo] = useState(null);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingMainContent, setLoadingMainContent] = useState(true); // For 1 sec skeleton on main content

  // Table search and filter
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Pagination
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      setLoadingDropdowns(true);
      try {
        const res = await getAllDepartments();
        if (!alive) return;
        if (res?.success) setDepartments(res.data || []);
      } catch (err) {
        console.error("Failed to fetch departments", err);
      } finally {
        setTimeout(() => {
          if (alive) setLoadingDropdowns(false);
        }, 1000);
      }
    };
    load();

    // Set 1 sec main content loading skeleton on initial mount
    const mainLoadTimer = setTimeout(() => {
      if (alive) setLoadingMainContent(false);
    }, 1000);

    return () => {
      alive = false;
      clearTimeout(mainLoadTimer);
    };
  }, []);

  const getBatchesByDepartment = async (departmentId) => {
    setBatches([]);
    setSections([]);
    setStudents([]);
    setDisplayInfo(null);
    try {
      const res = await fetchBatchesByDepartment(departmentId);
      if (res?.success) setBatches(res.data || []);
    } catch (err) {
      console.error("Error fetching batches", err);
    }
  };

  const fetchSectionsByBatch = async (batchId) => {
    setSections([]);
    setStudents([]);
    setDisplayInfo(null);
    try {
      const res = await fetchSectionsbyDepartementandBatchandYear(
        filters.department,
        batchId,
        "2025-2026"
      );
      if (res?.success) setSections(res.data || []);
    } catch (err) {
      console.error("Error fetching sections", err);
    }
  };

  const handleDepartmentChange = (e) => {
    const departmentId = e.target.value;
    setFilters({
      department: departmentId,
      batch: "",
      section: "",
    });
    if (departmentId) getBatchesByDepartment(departmentId);
    else {
      setBatches([]);
      setSections([]);
      setStudents([]);
      setDisplayInfo(null);
    }
    setPage(1);
  };

  const handleBatchChange = (e) => {
    const batchId = e.target.value;
    setFilters((prev) => ({ ...prev, batch: batchId, section: "" }));
    if (batchId) fetchSectionsByBatch(batchId);
    else {
      setSections([]);
      setStudents([]);
      setDisplayInfo(null);
    }
    setPage(1);
  };

  const handleSectionChange = (e) => {
    const sectionId = e.target.value;
    const sec = sections.find((x) => x._id === sectionId) || null;
    setFilters((prev) => ({ ...prev, section: sectionId }));
    setDisplayInfo(sec);
    setStudents([]);
    setPage(1);
  };

  const loadStudents = async () => {
    if (!filters.batch || !filters.section) {
      return alert("Please select batch and section before loading students.");
    }
    setLoadingStudents(true);
    setStudents([]);
    try {
      const secObj = sections.find((s) => s._id === filters.section);
      if (!secObj) {
        setLoadingStudents(false);
        return alert("Section data not found.");
      }
      const res = await fetchStudentsbyBatchandSection(filters.batch, secObj.sectionName);
      if (res?.success) {
        setStudents(res.data || []);
        setDisplayInfo(secObj);
        setPage(1);
      } else {
        setStudents([]);
        alert(res?.message || "Failed to fetch students.");
      }
    } catch (err) {
      console.error("Error fetching students", err);
      alert("Failed to fetch students. See console.");
    } finally {
      setTimeout(() => setLoadingStudents(false), 300);
    }
  };

  const filteredStudents = useMemo(() => {
    const query = q.trim().toLowerCase();
    return students.filter((s) => {
      if (statusFilter === "active" && !s.isActive) return false;
      if (statusFilter === "inactive" && s.isActive) return false;
      if (!query) return true;
      const name = String(s.name || "").toLowerCase();
      const email = String(s.email || "").toLowerCase();
      const roll = String(s.rollNumber || "").toLowerCase();
      const phone = String(s.phone || "").toLowerCase();
      return (
        name.includes(query) ||
        email.includes(query) ||
        roll.includes(query) ||
        phone.includes(query) ||
        (s._id || "").toLowerCase().includes(query)
      );
    });
  }, [students, q, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / pageSize));
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  const pagedStudents = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredStudents.slice(start, start + pageSize);
  }, [filteredStudents, page, pageSize]);

  const exportToXLSX = () => {
    if (!students.length) {
      alert("No students to export");
      return;
    }
    const data = filteredStudents.map((s, i) => ({
      "S.No": i + 1,
      Name: s.name,
      Email: s.email,
      "Roll Number": s.rollNumber || "-",
      Phone: s.phone || "-",
      Status: s.isActive ? "Active" : "Inactive",
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    XLSX.writeFile(wb, `${displayInfo?.sectionName || "section"}_students.xlsx`);
  };

  const printReport = () => {
    if (!filteredStudents.length) return alert("No student data to print.");
    const rowsHtml = filteredStudents
      .map(
        (s, idx) => `
      <tr>
        <td style="padding:8px;border:1px solid #ddd">${idx + 1}</td>
        <td style="padding:8px;border:1px solid #ddd">${s.name}</td>
        <td style="padding:8px;border:1px solid #ddd">${s.email}</td>
        <td style="padding:8px;border:1px solid #ddd">${s.rollNumber || "-"}</td>
        <td style="padding:8px;border:1px solid #ddd">${s.phone || "-"}</td>
        <td style="padding:8px;border:1px solid #ddd">${s.isActive ? "Active" : "Inactive"}</td>
      </tr>`
      )
      .join("");

    const headerHtml = `
      <div style="font-family: Arial, Helvetica, sans-serif; padding:20px">
        <h2 style="color:#5b2c6f;margin:0 0 8px 0">Students Report - ${displayInfo?.sectionName || ""}</h2>
        <p style="margin:0 0 16px 0;color:#333">Batch: ${
          batches.find((b) => b._id === filters.batch)?.batchName || ""
        }</p>
        <table style="width:100%;border-collapse:collapse;margin-top:8px">
          <thead>
            <tr>
              <th style="padding:10px;border:1px solid #ddd;background:#f3e5f5">S.No</th>
              <th style="padding:10px;border:1px solid #ddd;background:#f3e5f5">Name</th>
              <th style="padding:10px;border:1px solid #ddd;background:#f3e5f5">Email</th>
              <th style="padding:10px;border:1px solid #ddd;background:#f3e5f5">Roll No</th>
              <th style="padding:10px;border:1px solid #ddd;background:#f3e5f5">Phone</th>
              <th style="padding:10px;border:1px solid #ddd;background:#f3e5f5">Status</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
        <p style="margin-top:20px;color:#666;font-size:12px">Generated: ${new Date().toLocaleString()}</p>
      </div>
    `;
    const w = window.open("", "_blank", "width=1000,height=800");
    if (!w) return alert("Unable to open print window (blocked?).");
    w.document.write(`<html><head><title>Students Report</title></head><body>${headerHtml}</body></html>`);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 500);
  };

  return (
    <>
      <style>{`
        :root{
          --bg: #f7f6fb;
          --card: #fff;
          --primary: #5b2c6f;
          --accent: #8e44ad;
          --muted: #6c757d;
          --shadow: rgba(27, 31, 40, 0.06);
          --radius: 12px;
        }
        body { background: var(--bg); font-family: 'Poppins', sans-serif; }
        .page { display:flex; min-height:100vh; }
        .main {
          flex:1;
          padding:22px;
          transition: margin-left .28s ease;
          overflow:auto;
          position: relative;
          background: var(--bg);
          min-width: 0; /* Fix overflow on small */
        }
        .header-card {
          background: linear-gradient(90deg, rgba(139,47,140,0.06), rgba(139,47,140,0.02));
          border-radius: var(--radius);
          padding: 24px 18px;
          margin-bottom: 16px;
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:12px;
        }
        .title { 
          color: var(--primary); 
          font-weight: 800; 
          margin: 0; 
          font-size: 2.0rem;
          letter-spacing: -1px;
        }
        .subtitle { color: var(--muted); margin-top:7px; font-size: 15px; }
        .panel {
          background: var(--card);
          border-radius: var(--radius);
          padding: 16px;
          box-shadow: 0 8px 22px var(--shadow);
          margin-bottom: 16px;
        }
        .muted { color: var(--muted); }
        .chip {
          padding:6px 10px;
          border-radius:999px;
          font-weight:600;
          display:inline-block;
          font-size:13px;
        }
        .chip.active { background:#e8f5ea; color:#2e7d32; border:1px solid #c8e6c9; }
        .chip.inactive { background:#fff0f0; color:#c62828; border:1px solid #f5c6cb; }
        .table-responsive-custom {
          width:100%;
          overflow:auto;
          border-radius: 10px;
          -webkit-overflow-scrolling: touch;
          min-height: 220px;
        }
        table.app-table {
          width:100%;
          border-collapse:collapse;
          min-width: 720px;
        }
        table.app-table thead th {
          position: sticky;
          top: 0;
          background: linear-gradient(90deg, rgba(140,60,160,0.95), rgba(110,40,120,0.95));
          color:#fff;
          padding:12px;
          font-weight:700;
          z-index:2;
          text-align:left;
        }
        table.app-table td, table.app-table th {
          padding:10px 12px;
          border-bottom: 1px solid #f3f3f3;
          word-wrap: break-word;
          max-width: 200px;
        }
        .skeleton {
          background: linear-gradient(90deg,#ececec 25%, #f6f6f6 50%, #ececec 75%);
          background-size: 200% 100%;
          animation: shimmer 1.2s infinite linear;
          border-radius: 6px;
        }
        @keyframes shimmer {
          0% { background-position: -200% 0 }
          100% { background-position: 200% 0 }
        }
        .table-footer {
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-top:12px;
          gap:12px;
          flex-wrap:wrap;
        }
        .pager { display:flex; gap:8px; align-items:center; }
        /* Custom: Move search, export above the table on all screens */
        .table-searchbar-area {
          display:flex;
          flex-wrap:wrap;
          gap:12px;
          align-items:center;
          margin-bottom:14px;
          justify-content:space-between;
        }
        .table-search-controls {
          display:flex;
          gap:6px; /* less gap */
          flex-wrap:wrap;
          align-items:center;
          max-width: 100%;
        }
        .search-input-custom {
          position: relative;
          display: flex;
          align-items: center;
          width: 230px;
          background: #fff;
          border-radius: 30px;
          box-shadow: 0 0 8px #f0e7fb;
        }
        .search-input-custom input {
          border: none;
          background: transparent;
          font-size: 1rem;
          padding: 7px 12px 7px 36px;
          width: 100%;
          outline: none;
          min-width: 0;
        }
        .search-input-custom .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 1.1rem;
          color: #888;
        }
        .status-dropdown-custom {
          max-width: 95px;
          font-size: .89rem;
          padding-left: 8px;
          padding-right: 8px;
          height: 33px;
          border-radius: 18px;
          border: 1px solid #c8c5d6;
          background: #f7f6fb;
          color: #4e3659;
        }
        @media (max-width: 1000px) {
          .header-card { flex-direction:column; align-items:flex-start; gap:10px; }
          .title { font-size:2.2rem; }
          table.app-table { min-width: 540px; }
        }
        @media (max-width: 768px) {
          .main { padding:10px; }
          .header-card { padding:12px; gap:8px; }
          .panel { padding:10px; }
          .table-footer { flex-direction:column; align-items:flex-start; gap:8px; }
          .table-responsive-custom { min-height: 180px; }
          table.app-table { min-width: 480px; font-size:13px; }
          .pager div { min-width: 50px; font-size:13px; white-space: nowrap; }
          .table-searchbar-area { flex-direction:column; align-items:flex-start; gap:6px; }
          .search-input-custom { width: 160px; }
          .status-dropdown-custom { max-width: 120px;}
        }
        @media (max-width: 480px) {
          .main { padding:8px; }
          .header-card { padding:8px; }
          .panel { padding:6px; }
          table.app-table { min-width: 340px; font-size:12px; }
          .search-input-custom { width: 130px; }
          .status-dropdown-custom { max-width: 95px; font-size: 0.8rem;}
        }
      `}</style>
      <div className="page">
        <Sidebar onToggle={setSidebarOpen} />
        <main
          className="main"
          style={{ marginLeft: sidebarOpen ? "250px" : "80px" }}
          aria-busy={loadingMainContent || loadingStudents}
        >
          {(loadingMainContent || loadingStudents) && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "var(--card)",
                borderRadius: "var(--radius)",
                boxShadow: "0 8px 22px var(--shadow)",
                padding: 24,
                display: "flex",
                flexDirection: "column",
                gap: 16,
                zIndex: 10,
              }}
              aria-label="Loading content"
            >
              <div className="skeleton" style={{ height: 32, width: "50%" }} />
              <div className="skeleton" style={{ height: 24, width: "35%" }} />
              <div className="skeleton" style={{ height: 180, width: "100%", borderRadius: 12 }} />
              <div className="skeleton" style={{ height: 40, width: "100%", borderRadius: 12 }} />
              <div className="skeleton" style={{ height: 300, width: "100%", borderRadius: 12 }} />
              <div className="skeleton" style={{ height: 36, width: "100%", borderRadius: 12 }} />
            </div>
          )}

          {/* Header */}
          <div className="header-card" style={{ opacity: loadingMainContent ? 0.5 : 1 }}>
            <div>
              <h2 className="title">Section Students</h2>
              <div className="subtitle">
                Choose department, batch and section — click <strong>Load Students</strong>
              </div>
            </div>
          </div>
          {/* Filters */}
          <div className="panel" style={{ opacity: loadingMainContent ? 0.5 : 1 }}>
            <h5 className="mb-3">Select Section</h5>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Department *</label>
                <select
                  className="form-select"
                  value={filters.department}
                  onChange={handleDepartmentChange}
                  disabled={loadingDropdowns || loadingMainContent}
                  aria-disabled={loadingDropdowns || loadingMainContent}
                >
                  <option value="">
                    {loadingDropdowns ? "Loading..." : "Select department"}
                  </option>
                  {departments.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.departmentName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Batch *</label>
                <select
                  className="form-select"
                  value={filters.batch}
                  onChange={handleBatchChange}
                  disabled={!filters.department || loadingMainContent}
                  aria-disabled={!filters.department || loadingMainContent}
                >
                  <option value="">
                    {!filters.department ? "Select department first" : "Select batch"}
                  </option>
                  {batches.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.batchName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Section *</label>
                <select
                  className="form-select"
                  value={filters.section}
                  onChange={handleSectionChange}
                  disabled={!filters.batch || loadingMainContent}
                  aria-disabled={!filters.batch || loadingMainContent}
                >
                  <option value="">
                    {!filters.batch ? "Select batch first" : "Select section"}
                  </option>
                  {sections.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.sectionName} (Cap: {s.capacity})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-3 d-flex flex-wrap gap-2">
              <button
                className="btn btn-primary"
                onClick={loadStudents}
                disabled={
                  loadingStudents || !filters.batch || !filters.section || loadingMainContent
                }
              >
                {loadingStudents ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" />
                    Loading...
                  </>
                ) : (
                  "Load Students"
                )}
              </button>
              <button
                className="btn btn-outline-secondary"
                onClick={() => {
                  setFilters({ department: "", batch: "", section: "" });
                  setBatches([]);
                  setSections([]);
                  setStudents([]);
                  setDisplayInfo(null);
                }}
                disabled={loadingMainContent}
              >
                Clear Selection
              </button>
            </div>
          </div>
          {/* Section info */}
          {displayInfo && (
            <div className="panel" style={{ opacity: loadingMainContent ? 0.5 : 1 }}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 style={{ margin: 0 }}>Section Information</h6>
                  <div className="muted">
                    {batches.find((b) => b._id === filters.batch)?.batchName || ""}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className={`chip ${displayInfo?.capacity ? "active" : "inactive"}`}>
                    Capacity: {displayInfo?.capacity || "-"}
                  </div>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-md-3">
                  <strong>Section:</strong> {displayInfo?.sectionName}
                </div>
                <div className="col-md-3">
                  <strong>Academic Year:</strong> {displayInfo?.academicYear || "-"}
                </div>
                <div className="col-md-3">
                  <strong>Year:</strong> {displayInfo?.year || "-"}
                </div>
                <div className="col-md-3">
                  <strong>Students:</strong> {students.length}
                </div>
              </div>
            </div>
          )}

          {/* Table search, status and export - moved above actual table */}
          <div className="panel" style={{ opacity: loadingMainContent ? 0.5 : 1 }}>
            <div className="table-searchbar-area">
              <div className="table-search-controls">
                <div className="search-input-custom">
                  <span className="search-icon" aria-hidden="true">
                    <svg
                      width="18"
                      height="18"
                      fill="none"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        d="M12.8307 13.9298C11.5824 14.9467 9.9915 15.408 8.45776 15.1892C5.29494 14.7083 2.89245 11.8845 3.37335 8.72165C3.85425 5.55884 6.67809 3.15634 9.84091 3.63724C13.0037 4.11814 15.4062 6.94197 14.9253 10.1048C14.7065 11.6385 14.2452 13.2294 13.2283 14.4777L16.9879 18.5276C17.2377 18.8189 17.1455 19.2495 16.8156 19.4342C16.4858 19.6189 16.1051 19.4809 15.9364 19.171L12.8307 13.9298ZM8.69466 13.2732C11.0191 13.614 13.0892 11.8836 13.43 9.55916C13.7709 7.2347 12.0404 5.16459 9.71596 4.82373C7.3915 4.48287 5.3214 6.21331 4.98054 8.53778C4.63968 10.8622 6.37012 12.9323 8.69466 13.2732Z"
                        fill="#888"
                      />
                    </svg>
                  </span>
                  <input
                    className="form-control"
                    placeholder="Search students"
                    value={q}
                    onChange={(e) => {
                      setQ(e.target.value);
                      setPage(1);
                    }}
                    aria-label="Search students"
                    disabled={loadingMainContent}
                  />
                </div>
                <select
                  className="status-dropdown-custom"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                  }}
                  title="Filter by status"
                  disabled={loadingMainContent}
                  aria-disabled={loadingMainContent}
                >
                  <option value="">All</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => {
                    setQ("");
                    setStatusFilter("");
                    setPage(1);
                  }}
                  title="Reset filters"
                  style={{ height: 31, borderRadius: 14, fontSize: ".95rem", padding: "0 14px" }}
                  disabled={loadingMainContent}
                >
                  Reset
                </button>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button
                  className="btn btn-success"
                  onClick={exportToXLSX}
                  disabled={!students.length || loadingMainContent}
                  title="Export to XLSX"
                >
                  Export XLSX
                </button>
                <button
                  className="btn btn-primary"
                  onClick={printReport}
                  disabled={!students.length || loadingMainContent}
                  title="Print report"
                >
                  Print
                </button>
              </div>
            </div>

            {/* Students table */}
            <div className="table-responsive-custom" aria-live="polite" aria-busy={loadingStudents}>
              <table className="app-table" role="table" aria-label="Students table">
                <thead>
                  <tr>
                    <th style={{ width: 60 }} scope="col">
                      S.No
                    </th>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Roll No</th>
                    <th scope="col">Phone</th>
                    <th style={{ width: 120 }} scope="col">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loadingStudents ? (
                    Array.from({ length: pageSize }).map((_, i) => (
                      <tr key={i}>
                        <td>
                          <div className="skeleton" style={{ height: 12, width: 28 }} />
                        </td>
                        <td>
                          <div className="skeleton" style={{ height: 12, width: "70%" }} />
                        </td>
                        <td>
                          <div className="skeleton" style={{ height: 12, width: "80%" }} />
                        </td>
                        <td>
                          <div className="skeleton" style={{ height: 12, width: "60%" }} />
                        </td>
                        <td>
                          <div className="skeleton" style={{ height: 12, width: "60%" }} />
                        </td>
                        <td>
                          <div className="skeleton" style={{ height: 12, width: "50%" }} />
                        </td>
                      </tr>
                    ))
                  ) : pagedStudents.length > 0 ? (
                    pagedStudents.map((s, i) => (
                      <tr key={s._id || i}>
                        <td>{(page - 1) * pageSize + i + 1}</td>
                        <td>{s.name}</td>
                        <td>{s.email}</td>
                        <td>{s.rollNumber || "-"}</td>
                        <td>{s.phone || "-"}</td>
                        <td style={{ color: s.isActive ? "#2e7d32" : "#c62828", fontWeight: 700 }}>
                          {s.isActive ? "Active" : "Inactive"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", padding: 24 }}>
                        {!displayInfo
                          ? "Select a section and click Load Students to view results."
                          : "No students found for the selected section."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Table pagination and counts */}
            <div className="table-footer">
              <div className="muted">Showing {filteredStudents.length} result(s)</div>
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <label className="me-2 mb-0" htmlFor="rows-per-page-select">
                  Rows
                </label>
                <select
                  id="rows-per-page-select"
                  className="form-select"
                  style={{ width: 90 }}
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                  disabled={loadingMainContent}
                  aria-disabled={loadingMainContent}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <div className="pager" aria-label="Pagination">
                  <button
                    className="btn btn-outline-secondary"
                    disabled={page <= 1 || loadingMainContent}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    aria-disabled={page <= 1 || loadingMainContent}
                  >
                    Prev
                  </button>
                  <div style={{ minWidth: 70, textAlign: "center" }}>
                    Page {page} / {totalPages}
                  </div>
                  <button
                    className="btn btn-outline-secondary"
                    disabled={page >= totalPages || loadingMainContent}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    aria-disabled={page >= totalPages || loadingMainContent}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default SectionStudents;
