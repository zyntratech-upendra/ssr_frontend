import React, { useEffect, useState, useRef } from "react";
import Sidebar from "../components/Sidebar";
import { Building2, Search, Edit3, Trash2, CheckCircle, XCircle, Plus } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminRecruiters = () => {
  const [logos, setLogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [editingLogo, setEditingLogo] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [order, setOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [searchQ, setSearchQ] = useState("");
  const [onlyActive, setOnlyActive] = useState(false);
  const [sortDir, setSortDir] = useState("asc");

  const API_URL = import.meta.env.VITE_API_URL;
  const fileInputRef = useRef(null);

  const fetchLogos = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/recruiters`);
      const data = await res.json();
      if (data.success) setLogos(data.data || []);
      else showAlert("danger", "Failed to load recruiters");
    } catch {
      showAlert("danger", "Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogos();
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && showModal) closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showModal]);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4200);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const form = new FormData();
      form.append("companyName", companyName);
      form.append("order", order);
      form.append("isActive", isActive ? "true" : "false");
      if (imageFile) form.append("image", imageFile);

      const method = editingLogo ? "PUT" : "POST";
      const url = editingLogo
        ? `${API_URL}/api/recruiters/${editingLogo._id}`
        : `${API_URL}/api/recruiters`;

      const res = await fetch(url, { method, body: form });
      const data = await res.json();

      if (data.success) {
        showAlert("success", data.message || "Saved successfully");
        await fetchLogos();
        closeModal();
      } else {
        showAlert("danger", data.message || "Save failed");
      }
    } catch {
      showAlert("danger", "Error saving image");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingLogo(null);
    setCompanyName("");
    setOrder(0);
    setIsActive(true);
    setPreview(null);
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleEdit = (logo) => {
    setEditingLogo(logo);
    setCompanyName(logo.companyName || "");
    setOrder(logo.order ?? 0);
    setIsActive(logo.isActive ?? true);
    setPreview(logo.imageUrl || null);
    setImageFile(null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this recruiter logo?")) return;
    try {
      const res = await fetch(`${API_URL}/api/recruiters/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showAlert("success", "Logo deleted");
        fetchLogos();
      } else {
        showAlert("danger", "Delete failed");
      }
    } catch {
      showAlert("danger", "Network error");
    }
  };

  const onFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) {
      setPreview(null);
      setImageFile(null);
      return;
    }
    setImageFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const clearImage = () => {
    setImageFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const displayed = logos
    .filter((l) => {
      if (!searchQ) return true;
      const q = searchQ.toLowerCase();
      return (
        (l.companyName || "").toLowerCase().includes(q) ||
        String(l.order ?? "").includes(q)
      );
    })
    .filter((l) => (onlyActive ? l.isActive === true : true))
    .sort((a, b) => {
      const A = Number(a.order || 0);
      const B = Number(b.order || 0);
      return sortDir === "asc" ? A - B : B - A;
    });

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
          --success: #10b981;
          --danger: #ef4444;
        }

        body {
          margin: 0;
          height: 100vh;
          font-family: 'Inter', 'Poppins', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
          background: linear-gradient(135deg, #f7f4ff, #eef2ff);
          color: var(--text-dark);
          overflow: hidden;
        }

        .admin-page {
          display: flex;
          height: 100vh;
          width: 100%;
        }

        .main-content {
          flex: 1;
          padding: clamp(16px, 3vw, 36px);
          transition: margin-left 0.36s cubic-bezier(.2,.9,.2,1);
          overflow-y: auto;
          height: 100vh;
        }

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

        .page-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          margin-bottom: clamp(20px, 4vw, 32px);
          flex-wrap: wrap;
        }

        .page-title {
          font-size: clamp(20px, 2.5vw, 28px);
          font-weight: 700;
          letter-spacing: -0.2px;
          color: var(--primary-dark);
          margin: 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .page-subtitle {
          font-size: clamp(14px, 2vw, 16px);
          color: var(--text-muted);
          font-weight: 500;
          margin: 0;
        }

        .toolbar {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
        }

        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
          }
          .toolbar {
            flex-direction: column;
            align-items: stretch;
          }
        }

        .search-wrapper {
          position: relative;
          min-width: 220px;
          flex: 1;
        }

        .search-wrapper input {
          padding-left: 44px !important;
        }

        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          z-index: 2;
          pointer-events: none;
        }

        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: clamp(16px, 3vw, 22px);
          margin-top: clamp(18px, 3vw, 24px);
        }

        @media (max-width: 640px) {
          .cards-grid {
            grid-template-columns: 1fr;
          }
        }

        .card-advanced {
          background: linear-gradient(135deg,#ffffff,var(--primary-soft));
          border-radius: 16px;
          padding: clamp(16px, 3vw, 22px);
          border: 1px solid rgba(173,143,248,0.16);
          box-shadow: 0 10px 28px rgba(0,0,0,0.06);
          transition: 0.26s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          height: 100%;
        }

        .card-advanced:hover {
          transform: translateY(-4px);
          box-shadow: 0 18px 40px rgba(173,143,248,0.26);
        }

        .logo-wrap {
          width: 100%;
          height: 120px;
          background: #f9fafb;
          border-radius: 10px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px dashed #e5e7eb;
        }

        .logo-wrap img {
          max-height: 90px;
          max-width: 90%;
          object-fit: contain;
        }

        .company {
          margin-top: 12px;
          font-weight: 700;
          font-size: 15px;
          color: var(--text-dark);
          word-break: break-word;
        }

        .meta-row {
          display: flex;
          gap: 8px;
          margin-top: 10px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .badge-order {
          padding: 6px 10px;
          font-size: 13px;
          border-radius: 999px;
          background: rgba(106,78,217,.08);
          color: var(--primary-dark);
          font-weight: 700;
        }

        .badge-state {
          padding: 6px 10px;
          font-size: 13px;
          border-radius: 999px;
          color: white;
          font-weight: 700;
        }

        .badge-active { background: #22c55e; }
        .badge-inactive { background: #99a0a6; }

        .card-actions {
          display: flex;
          gap: 8px;
          margin-top: 14px;
          width: 100%;
          flex-wrap: wrap;
        }

        @media (max-width: 768px) {
          .card-actions {
            flex-direction: column;
          }
        }

        .btn-card {
          flex: 1;
          min-height: 40px;
          font-size: 14px;
          border-radius: 10px !important;
        }

        .alert-custom {
          border-radius: 12px;
          border: none;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
        }

        .alert-custom.success {
          background: rgba(16,185,129,0.15);
          color: var(--success);
          border: 1px solid rgba(16,185,129,0.3);
        }

        .alert-custom.danger {
          background: rgba(239,68,68,0.15);
          color: var(--danger);
          border: 1px solid rgba(239,68,68,0.3);
        }

        .loading-state, .empty-state {
          text-align: center;
          padding: clamp(60px, 15vw, 100px);
          color: var(--text-muted);
        }

        .modal-backdrop-custom {
          position: fixed;
          inset: 0;
          background: rgba(7,8,12,0.5);
          backdrop-filter: blur(10px);
          display: flex;
          justify-content: center;
          align-items: center;
          padding: clamp(12px, 4vw, 24px);
          z-index: 2000;
        }

        .modal-glass {
          width: 100%;
          max-width: clamp(360px, 90vw, 500px);
          background: rgba(255,255,255,0.98);
          padding: clamp(22px, 5vw, 30px);
          border-radius: 18px;
          box-shadow: 0 22px 48px rgba(0,0,0,0.22);
          backdrop-filter: blur(14px);
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header-custom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 14px;
          border-bottom: 1px solid var(--border);
          gap: 10px;
        }

        .modal-title {
          font-size: clamp(18px, 4vw, 22px);
          font-weight: 700;
          margin: 0;
          color: var(--text-dark);
        }

        .preview-img {
          max-height: 180px;
          width: 100%;
          object-fit: contain;
          border-radius: 12px;
          border: 1px solid var(--border);
          background: #f9fafb;
        }

        @media (max-width: 768px) {
          .modal-glass {
            max-width: 95vw;
          }
        }

        @media (max-width: 480px) {
          .main-content {
            padding: 10px;
          }
        }
      `}</style>

      <div className="admin-page">
        <Sidebar onToggle={setSidebarOpen} />
        <main
          className="main-content"
          style={{
            marginLeft: sidebarOpen ? "var(--sidebar-width)" : "var(--sidebar-collapsed)",
          }}
        >
          {/* HEADER */}
          <div className="page-header">
            <div>
              <h2 className="page-title">
                <Building2 size={26} />
                Recruiter Logos
              </h2>
              <p className="page-subtitle">
                Manage logos shown in your placements / partners section
              </p>
            </div>

            <div className="toolbar">
              <div className="search-wrapper">
                <Search className="search-icon" size={18} />
                <input
                  type="search"
                  className="form-control form-control-lg"
                  placeholder="Search by company or order..."
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                />
              </div>

              <div className="d-flex align-items-center gap-2">
                <div className="form-check form-switch mb-0">
                  <input
                    id="onlyActive"
                    className="form-check-input"
                    type="checkbox"
                    checked={onlyActive}
                    onChange={(e) => setOnlyActive(e.target.checked)}
                  />
                </div>
                <label className="text-muted fw-medium mb-0" htmlFor="onlyActive">
                  Active only
                </label>
              </div>

              <div className="btn-group" role="group">
                <button
                  className={`btn btn-outline-primary btn-sm ${sortDir === "asc" ? "active" : ""}`}
                  onClick={() => setSortDir("asc")}
                >
                  Order ↑
                </button>
                <button
                  className={`btn btn-outline-primary btn-sm ${sortDir === "desc" ? "active" : ""}`}
                  onClick={() => setSortDir("desc")}
                >
                  Order ↓
                </button>
              </div>

              <button
                className="btn btn-primary fw-semibold d-flex align-items-center"
                style={{ background: "var(--primary)", border: "none" }}
                onClick={() => setShowModal(true)}
              >
                <Plus size={18} className="me-2" />
                Add
              </button>
            </div>
          </div>

          {/* ALERT */}
          {alert && (
            <div
              className={`alert-custom ${
                alert.type === "success" ? "success" : "danger"
              } mb-3`}
            >
              {alert.type === "success" ? <CheckCircle size={18} /> : <XCircle size={18} />}
              {alert.message}
            </div>
          )}

          {/* GRID / STATES */}
          {loading ? (
            <div className="loading-state">
              <div
                style={{
                  fontSize: "clamp(44px, 12vw, 60px)",
                  marginBottom: "18px",
                  opacity: 0.6,
                }}
              >
                ⏳
              </div>
              Loading recruiters…
            </div>
          ) : displayed.length === 0 ? (
            <div className="empty-state">
              <div
                style={{
                  fontSize: "clamp(56px, 16vw, 72px)",
                  marginBottom: "20px",
                  opacity: 0.6,
                }}
              >
                🏢
              </div>
              No recruiters found. Try changing filters or add a new logo.
            </div>
          ) : (
            <section className="cards-grid">
              {displayed.map((logo) => (
                <article key={logo._id} className="card-advanced">
                  <div className="logo-wrap">
                    <img src={logo.imageUrl} alt={`${logo.companyName} logo`} />
                  </div>
                  <div className="company">{logo.companyName}</div>
                  <div className="meta-row">
                    <div className="badge-order">Order: {logo.order ?? 0}</div>
                    <div
                      className={`badge-state ${
                        logo.isActive ? "badge-active" : "badge-inactive"
                      }`}
                    >
                      {logo.isActive ? "Active" : "Inactive"}
                    </div>
                  </div>
                  <div className="card-actions">
                    <button
                      className="btn btn-warning btn-card text-white"
                      onClick={() => handleEdit(logo)}
                    >
                      <Edit3 size={16} className="me-1" />
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-card"
                      onClick={() => handleDelete(logo._id)}
                    >
                      <Trash2 size={16} className="me-1" />
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </section>
          )}

          {/* MODAL */}
          {showModal && (
            <div className="modal-backdrop-custom" onClick={closeModal}>
              <div className="modal-glass" onClick={(e) => e.stopPropagation()}>
                <header className="modal-header-custom">
                  <h3 className="modal-title">
                    {editingLogo ? "Edit Recruiter" : "Add Recruiter"}
                  </h3>
                  <div className="d-flex gap-2">
                    {preview && (
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={clearImage}
                      >
                        Clear
                      </button>
                    )}
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      onClick={closeModal}
                    >
                      <XCircle size={16} />
                    </button>
                  </div>
                </header>

                <form onSubmit={handleSubmit}>
                  <div className="mt-3">
                    <label className="form-label fw-semibold">Company Name</label>
                    <input
                      className="form-control form-control-lg"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>

                  <div className="mt-3">
                    <label className="form-label fw-semibold">Order</label>
                    <input
                      type="number"
                      className="form-control form-control-lg"
                      value={order}
                      onChange={(e) => setOrder(Number(e.target.value))}
                      min="0"
                    />
                  </div>

                  <div className="mt-3">
                    <label className="form-label fw-semibold">Logo Image</label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="form-control"
                      onChange={onFileChange}
                    />
                  </div>

                  {preview && (
                    <div className="text-center mt-3">
                      <img src={preview} className="preview-img" alt="Preview" />
                    </div>
                  )}

                  <div className="form-check form-switch mt-3">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="recruiterActive"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="recruiterActive">
                      Active
                    </label>
                  </div>

                  <div className="d-flex justify-content-end mt-4 gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-secondary px-4"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-primary px-4 fw-semibold"
                      style={{ background: "var(--primary)", border: "none" }}
                      disabled={loading}
                    >
                      {loading ? "Saving…" : editingLogo ? "Update" : "Add"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default AdminRecruiters;
