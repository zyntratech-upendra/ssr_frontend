import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList, Eye, FileDown, Phone, User } from "lucide-react";
import { getAllApplications } from "../services/admissonService.jsx";
import Sidebar from "../components/Sidebar";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import "bootstrap/dist/css/bootstrap.min.css";

function ApplicationListing() {
  const [applications, setApplications] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await getAllApplications();
        if (res.success) {
          setApplications(res.data);
          setFiltered(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch applications", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  /* FILTER + SEARCH */
  useEffect(() => {
    let data = [...applications];

    if (search) {
      const q = search.toLowerCase();
      data = data.filter(
        (a) =>
          String(a.applicationId).includes(q) ||
          (a.studentName || "").toLowerCase().includes(q) ||
          (a.mobileNo || "").includes(q)
      );
    }

    if (statusFilter !== "all") {
      data = data.filter(
        (a) => (a.status || "").toLowerCase() === statusFilter
      );
    }

    setPage(1);
    setFiltered(data);
  }, [search, statusFilter, applications]);

  /* PAGINATION */
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  /* EXPORT */
  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filtered);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Applications");
    XLSX.writeFile(wb, "applications.xlsx");
  };

  const exportPDF = () => {
  const doc = new jsPDF();

  doc.text("Applications List", 14, 14);

  autoTable(doc, {
    startY: 20,
    head: [["ID", "Name", "Phone", "Gender", "Status"]],
    body: filtered.map((a) => [
      a.applicationId,
      a.studentName,
      a.mobileNo,
      a.gender,
      a.status,
    ]),
  });

  doc.save("applications.pdf");
};


  return (
    <>
      <style>{`
        :root {
          --sidebar-width: 250px;
          --sidebar-collapsed: 80px;
          --primary: #0f766e;
          --secondary: #14b8a6;
        }

        body {
          background: linear-gradient(135deg,#ecfeff,#f0fdfa);
          font-family: 'Poppins', sans-serif;
          height: 100vh;
          overflow: hidden;
        }

        .page-layout {
          display: flex;
          height: 100vh;
        }

        .main-content {
          flex: 1;
          padding: 24px 28px;
          overflow: hidden;
          transition: margin-left .3s ease;
        }

        .page-title {
          font-size: 26px;
          font-weight: 700;
          color: var(--primary);
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .toolbar {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 16px;
        }

        .list-scroll {
          background: #fff;
          border-radius: 14px;
          padding: 16px;
          box-shadow: 0 8px 22px rgba(0,0,0,0.08);
          height: calc(100vh - 260px);
          overflow-y: auto;
        }

        /* TABLE (DESKTOP) */
        table {
          width: 100%;
          border-collapse: collapse;
        }

        th {
          background: linear-gradient(90deg,var(--primary),var(--secondary));
          color: white;
          padding: 12px;
        }

        td {
          padding: 12px;
          border-bottom: 1px solid #eee;
        }

        tr:hover td {
          background: #f0fdfa;
        }

        .badge-status {
          padding: 6px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
        }

        .approved { background:#dcfce7; color:#166534; }
        .submitted, .pending { background:#fef3c7; color:#92400e; }
        .rejected { background:#fee2e2; color:#991b1b; }

        .btn-view {
          background: linear-gradient(90deg,var(--primary),var(--secondary));
          color:#fff;
          border:none;
          padding:6px 14px;
          border-radius:20px;
          font-size:13px;
          display:inline-flex;
          align-items:center;
          gap:6px;
        }

        /* MOBILE CARDS */
        .app-card {
          background: #fff;
          border-radius: 14px;
          padding: 16px;
          box-shadow: 0 6px 16px rgba(0,0,0,0.06);
          margin-bottom: 12px;
        }

        .app-card h6 {
          font-weight: 700;
          margin-bottom: 6px;
        }

        .app-meta {
          font-size: 14px;
          color: #555;
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 6px;
        }

        @media (max-width: 992px) {
          .desktop-table { display: none; }
        }

        @media (min-width: 993px) {
          .mobile-cards { display: none; }
        }

        @media (max-width: 768px) {
          .main-content { padding: 16px; }
          .page-title { font-size: 22px; }
        }
      `}</style>

      <div className="page-layout">
        <Sidebar onToggle={setSidebarOpen} />

        <div
          className="main-content"
          style={{
            marginLeft: sidebarOpen
              ? "var(--sidebar-width)"
              : "var(--sidebar-collapsed)",
          }}
        >
          <h1 className="page-title mb-2">
            <ClipboardList size={26} /> Applications
          </h1>

          <div className="toolbar">
            <input
              className="form-control"
              style={{ maxWidth: 240 }}
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="form-select"
              style={{ maxWidth: 180 }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="submitted">Submitted</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            <button className="btn btn-outline-success btn-sm" onClick={exportExcel}>
              <FileDown size={14} /> Excel
            </button>
            <button className="btn btn-outline-danger btn-sm" onClick={exportPDF}>
              <FileDown size={14} /> PDF
            </button>
          </div>

          <div className="list-scroll">
            {/* DESKTOP TABLE */}
            <div className="desktop-table">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Gender</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((app, index) => (
                    <tr key={`${app._id || app.applicationId}-${index}`}>
                      <td>{app.applicationId}</td>
                      <td>{app.studentName}</td>
                      <td>{app.mobileNo}</td>
                      <td>{app.gender}</td>
                      <td>
                        <span className={`badge-status ${(app.status || "").toLowerCase()}`}>
                          {app.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn-view"
                          onClick={() => navigate(`/applications/${app.applicationId}`)}
                        >
                          <Eye size={14} /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MOBILE CARDS */}
            <div className="mobile-cards">
              {pageItems.map((app, index) => (
                <div key={`${app._id || app.applicationId}-${index}`} className="app-card">
                  <h6>{app.studentName}</h6>
                  <div className="app-meta"><User size={14} /> {app.applicationId}</div>
                  <div className="app-meta"><Phone size={14} /> {app.mobileNo}</div>
                  <span className={`badge-status ${(app.status || "").toLowerCase()}`}>
                    {app.status}
                  </span>
                  <div className="mt-2">
                    <button
                      className="btn-view"
                      onClick={() => navigate(`/applications/${app.applicationId}`)}
                    >
                      <Eye size={14} /> View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* PAGINATION */}
            <div className="d-flex justify-content-between align-items-center mt-3">
              <span>Page {page} of {totalPages}</span>
              <div className="btn-group">
                <button
                  className="btn btn-outline-secondary btn-sm"
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                >
                  Prev
                </button>
                <button
                  className="btn btn-outline-secondary btn-sm"
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                >
                  Next
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default ApplicationListing;
