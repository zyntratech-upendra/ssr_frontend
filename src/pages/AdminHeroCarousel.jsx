import React, { useState, useEffect, useRef } from "react";
import { Image, Plus, Search, CheckCircle, XCircle, Edit3, Trash2 } from "lucide-react";
import Sidebar from "../components/Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminHeroCarousel = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editingSlide, setEditingSlide] = useState(null);
  const [order, setOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [searchQ, setSearchQ] = useState("");
  const [onlyActive, setOnlyActive] = useState(false);
  const [sortDir, setSortDir] = useState("asc");

  const API_URL = import.meta.env.VITE_API_URL;
  const fileInputRef = useRef(null);

  const fetchSlides = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/hero-carousel/slides`);
      const data = await res.json();
      if (data.success) setSlides(data.data || []);
      else showAlert("danger", "Failed to load slides");
    } catch {
      showAlert("danger", "Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
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
      form.append("order", order);
      form.append("isActive", isActive ? "true" : "false");
      if (imageFile) form.append("image", imageFile);

      const method = editingSlide ? "PUT" : "POST";
      const url = editingSlide
        ? `${API_URL}/api/hero-carousel/slides/${editingSlide._id}`
        : `${API_URL}/api/hero-carousel/slides`;

      const res = await fetch(url, { method, body: form });
      const data = await res.json();

      if (data.success) {
        showAlert("success", editingSlide ? "Slide updated" : "Slide added");
        fetchSlides();
        closeModal();
      } else {
        showAlert("danger", data.message || "Save failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSlide(null);
    setOrder(0);
    setIsActive(true);
    setImageFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleEdit = (slide) => {
    setEditingSlide(slide);
    setOrder(slide.order);
    setIsActive(slide.isActive);
    setPreview(slide.imageUrl);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this slide?")) return;
    try {
      await fetch(`${API_URL}/api/hero-carousel/slides/${id}`, { method: "DELETE" });
      showAlert("success", "Slide deleted");
      fetchSlides();
    } catch {
      showAlert("danger", "Delete failed");
    }
  };

  const onFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setImageFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const clearImage = () => {
    setImageFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const displayed = slides
    .filter((s) => (searchQ ? String(s.order).includes(searchQ) : true))
    .filter((s) => (onlyActive ? s.isActive : true))
    .sort((a, b) =>
      sortDir === "asc" ? a.order - b.order : b.order - a.order
    );

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
          --warning: #f59e0b;
        }

        body {
          margin: 0;
          height: 100vh;
          font-family: 'Inter', 'Poppins', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
          background: linear-gradient(135deg, #f7f4ff, #eef2ff);
          color: var(--text-dark);
          overflow: hidden;
        }

        .admin-container {
          display: flex;
          height: 100vh;
          width: 100%;
        }

        .main-content {
          flex-grow: 1;
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

        .admin-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          margin-bottom: clamp(20px, 4vw, 32px);
          flex-wrap: wrap;
        }

        .page-title {
          font-size: clamp(20px, 2.5vw, 32px);
          font-weight: 700;
          letter-spacing: -0.2px;
          color: var(--primary-dark);
          margin: 0;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .subtitle {
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
          .toolbar {
            flex-direction: column;
            align-items: stretch;
            width: 100%;
            gap: 8px;
          }
        }

        .search-wrapper {
          position: relative;
          min-width: 240px;
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

        .carousel-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: clamp(18px, 3vw, 24px);
          margin-top: clamp(20px, 4vw, 32px);
        }

        @media (max-width: 640px) {
          .carousel-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }

        .slide-card {
          background: linear-gradient(135deg, #ffffff, var(--primary-soft));
          border-radius: 16px;
          padding: clamp(20px, 4vw, 28px);
          text-align: center;
          box-shadow: 0 10px 30px rgba(173,143,248,0.18);
          transition: all 0.3s ease;
          border: 1px solid rgba(173,143,248,0.12);
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .slide-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(173,143,248,0.28);
        }

        .slide-image {
          width: 100%;
          height: clamp(140px, 30vw, 180px);
          background: linear-gradient(135deg, #f8fafc, #e2e8f0);
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 16px;
          border: 2px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .slide-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .slide-meta {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: center;
          margin-bottom: 20px;
        }

        .badge-custom {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: clamp(12px, 2vw, 14px);
          font-weight: 600;
          display: inline-flex;
          align-items: center;
        }

        .badge-order {
          background: rgba(173,143,248,0.15);
          color: var(--primary-dark);
        }

        .badge-active {
          background: rgba(16,185,129,0.2);
          color: var(--success);
        }

        .badge-inactive {
          background: rgba(148,163,184,0.3);
          color: #94a3b8;
        }

        .card-actions {
          margin-top: auto;
          width: 100%;
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .btn-custom {
          flex: 1;
          padding: clamp(10px, 2vw, 12px) !important;
          border-radius: 10px !important;
          font-weight: 600 !important;
          font-size: clamp(13px, 2vw, 14px) !important;
          transition: all 0.3s ease !important;
          border: none !important;
          min-height: 44px;
        }

        .btn-edit-custom {
          background: linear-gradient(135deg, #f59e0b, #d97706) !important;
          color: white !important;
        }

        .btn-edit-custom:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 20px rgba(245,158,11,0.4) !important;
        }

        .btn-delete-custom {
          background: linear-gradient(135deg, #ef4444, #dc2626) !important;
          color: white !important;
        }

        .btn-delete-custom:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 20px rgba(239,68,68,0.4) !important;
        }

        .modal-backdrop-custom {
          position: fixed;
          inset: 0;
          background: rgba(7,8,12,0.5);
          backdrop-filter: blur(12px);
          display: flex;
          justify-content: center;
          align-items: center;
          padding: clamp(12px, 4vw, 24px);
          z-index: 2000;
        }

        .modal-content-custom {
          width: 100%;
          max-width: clamp(360px, 90vw, 500px);
          background: rgba(255,255,255,0.98);
          border-radius: 20px;
          padding: clamp(24px, 6vw, 32px);
          box-shadow: 0 25px 50px rgba(0,0,0,0.25);
          backdrop-filter: blur(16px);
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header-custom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--border);
          gap: 12px;
        }

        .modal-title-custom {
          font-size: clamp(18px, 4vw, 24px);
          font-weight: 700;
          color: var(--text-dark);
          margin: 0;
          flex: 1;
        }

        .preview-image {
          width: 100%;
          max-height: clamp(160px, 40vw, 220px);
          object-fit: cover;
          border-radius: 12px;
          border: 3px solid var(--border);
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
        }

        .alert-custom {
          border-radius: 12px;
          border: none;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: clamp(12px, 2vw, 16px) clamp(20px, 3vw, 24px);
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

        @media (max-width: 768px) {
          .admin-header {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
            gap: 16px;
          }
          .toolbar {
            justify-content: center;
          }
          .card-actions {
            flex-direction: column;
          }
        }

        @media (max-width: 480px) {
          .modal-content-custom {
            margin: 8px;
            padding: clamp(16px, 8vw, 24px);
          }
        }
      `}</style>

      <div className="admin-container">
        <Sidebar onToggle={setSidebarOpen} />
        <main 
          className="main-content"
          style={{
            marginLeft: sidebarOpen 
              ? "var(--sidebar-width)" 
              : "var(--sidebar-collapsed)",
          }}
        >
          {/* HEADER */}
          <div className="admin-header">
            <div>
              <h1 className="page-title">
                <Image size={28} />
                Hero Carousel
              </h1>
              <p className="subtitle">Manage homepage hero slider images</p>
            </div>

            <div className="toolbar">
              <div className="search-wrapper position-relative">
                <Search className="search-icon" size={20} />
                <input
                  type="search"
                  className="form-control form-control-lg"
                  placeholder="Search by order..."
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                />
              </div>

              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={onlyActive}
                  onChange={(e) => setOnlyActive(e.target.checked)}
                  id="activeOnly"
                />
                <label className="form-check-label text-muted fw-medium" htmlFor="activeOnly">
                  Active only
                </label>
              </div>

              <div className="btn-group" role="group">
                <button
                  className={`btn btn-outline-primary btn-sm ${sortDir === "asc" ? "active" : ""}`}
                  onClick={() => setSortDir("asc")}
                >
                  ↑ Order
                </button>
                <button
                  className={`btn btn-outline-primary btn-sm ${sortDir === "desc" ? "active" : ""}`}
                  onClick={() => setSortDir("desc")}
                >
                  ↓ Order
                </button>
              </div>

              <button 
                className="btn btn-primary px-4 fw-semibold" 
                style={{ background: "var(--primary)", border: "none" }}
                onClick={() => setShowModal(true)}
              >
                <Plus size={20} className="me-2" />
                Add Slide
              </button>
            </div>
          </div>

          {/* ALERT */}
          {alert && (
            <div className={`alert-custom alert alert-${alert.type} mb-4`}>
              {alert.type === "success" ? <CheckCircle size={20} /> : <XCircle size={20} />}
              {alert.message}
            </div>
          )}

          {/* CONTENT */}
          {loading ? (
            <div className="loading-state">
              <div style={{ fontSize: 'clamp(48px, 12vw, 64px)', marginBottom: '20px', opacity: 0.6 }}>
                ⏳
              </div>
              Loading slides...
            </div>
          ) : displayed.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: 'clamp(64px, 16vw, 80px)', marginBottom: '24px', opacity: 0.6 }}>
                🖼️
              </div>
              {searchQ || onlyActive ? "No slides match your filters" : "No slides available. Add your first slide!"}
            </div>
          ) : (
            <div className="carousel-grid">
              {displayed.map((slide) => (
                <div key={slide._id} className="slide-card h-100">
                  <div className="slide-image">
                    <img src={slide.imageUrl} alt={`Slide ${slide.order}`} />
                  </div>
                  <div className="slide-meta">
                    <div className="badge-custom badge-order">
                      Order: {slide.order}
                    </div>
                    <div className={`badge-custom ${slide.isActive ? "badge-active" : "badge-inactive"}`}>
                      {slide.isActive ? "Active" : "Inactive"}
                    </div>
                  </div>
                  <div className="card-actions">
                    <button 
                      className="btn-custom btn-edit-custom btn" 
                      onClick={() => handleEdit(slide)}
                    >
                      <Edit3 size={16} className="me-1" />
                      Edit
                    </button>
                    <button 
                      className="btn-custom btn-delete-custom btn" 
                      onClick={() => handleDelete(slide._id)}
                    >
                      <Trash2 size={16} className="me-1" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* MODAL */}
          {showModal && (
            <div className="modal-backdrop-custom" onClick={closeModal}>
              <div className="modal-content-custom" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header-custom">
                  <h3 className="modal-title-custom">
                    {editingSlide ? "Edit Slide" : "Add New Slide"}
                  </h3>
                  <div className="d-flex gap-2">
                    {preview && (
                      <button className="btn btn-outline-secondary btn-sm" onClick={clearImage}>
                        Clear
                      </button>
                    )}
                    <button className="btn btn-outline-secondary btn-sm" onClick={closeModal}>
                      <XCircle size={16} />
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Slide Image</label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="form-control form-control-lg"
                      onChange={onFileChange}
                      required={!editingSlide}
                    />
                  </div>

                  {preview && (
                    <div className="text-center mb-4">
                      <img src={preview} className="preview-image" alt="Preview" />
                    </div>
                  )}

                  <div className="mb-4">
                    <label className="form-label fw-semibold">Order</label>
                    <input
                      type="number"
                      className="form-control form-control-lg"
                      value={order}
                      onChange={(e) => setOrder(Number(e.target.value))}
                      min="0"
                      placeholder="Enter order number"
                    />
                  </div>

                  <div className="form-check form-switch mb-4">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      id="slideActive"
                    />
                    <label className="form-check-label fw-medium" htmlFor="slideActive">
                      Active
                    </label>
                  </div>

                  <div className="d-flex gap-3 justify-content-end">
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary px-4" 
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary px-4 fw-semibold"
                      disabled={loading}
                      style={{ background: "var(--primary)", border: "none" }}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          Saving...
                        </>
                      ) : editingSlide ? (
                        "Update Slide"
                      ) : (
                        "Add Slide"
                      )}
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

export default AdminHeroCarousel;
