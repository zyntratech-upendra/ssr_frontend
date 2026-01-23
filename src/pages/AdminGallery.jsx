// src/pages/AdminGallery.jsx
import React, { useEffect, useState, useRef } from "react";
import uploadGallery from "../services/uploadGallery";
import Sidebar from "../components/Sidebar";
import {
  Plus,
  Trash2,
  Edit,
  Upload,
  X,
  Search as SearchIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const PAGE_SIZES = [6, 12, 24];

export default function AdminGallery() {
  // --- States ---
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showEventPanel, setShowEventPanel] = useState(false);
  const [showSinglePanel, setShowSinglePanel] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [preview, setPreview] = useState(null);

  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);

  const [eventForm, setEventForm] = useState({
    eventName: "",
    eventDate: "",
    eventDescription: "",
    files: [],
  });
  const [eventUploadProgress, setEventUploadProgress] = useState({});
  const [eventUploading, setEventUploading] = useState(false);

  const [singleFile, setSingleFile] = useState(null);
  const [singleUploadProgress, setSingleUploadProgress] = useState(0);
  const [singleUploading, setSingleUploading] = useState(false);

  const [editingItem, setEditingItem] = useState(null);
  const [editAddFiles, setEditAddFiles] = useState([]);
  const [editUploadProgress, setEditUploadProgress] = useState({});
  const [editUploading, setEditUploading] = useState(false);

  const eventDropRef = useRef();
  const editDropRef = useRef();
  const objectUrlRefs = useRef([]);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [alert, setAlert] = useState(null);

  // --- Effects ---
  useEffect(() => {
    fetchItems();
    return () => {
      objectUrlRefs.current.forEach((u) => {
        try {
          URL.revokeObjectURL(u);
        } catch {}
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchItems() {
    setLoading(true);
    try {
      const res = await uploadGallery.get("/gallery");
      setItems(res.data?.items || []);
    } catch (err) {
      console.error("Fetch gallery failed:", err.response?.data || err.message || err);
      showAlert("danger", "Failed to load gallery");
    } finally {
      setLoading(false);
    }
  }

  // Alerts
  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4200);
  };

  // --- Filtering & Pagination ---
  const filtered = items
    .filter((it) => (filterType === "all" ? true : it.type === filterType))
    .filter((it) => {
      if (!query) return true;
      const q = query.toLowerCase();
      if (it.type === "event") {
        return (
          (it.eventName || "").toLowerCase().includes(q) ||
          (it.eventDescription || "").toLowerCase().includes(q)
        );
      } else {
        return (it.singleImage?.public_id || "").toLowerCase().includes(q);
      }
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  // --- Drag & Drop (event) ---
  useEffect(() => {
    const el = eventDropRef.current;
    if (!el) return;
    function onDragOver(e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
      el.classList.add("drag-over");
    }
    function onDragLeave() {
      el.classList.remove("drag-over");
    }
    function onDrop(e) {
      e.preventDefault();
      el.classList.remove("drag-over");
      const files = Array.from(e.dataTransfer.files)
        .filter((f) => f.type.startsWith("image"))
        .filter(
          (newFile) =>
            !eventForm.files.some((f) => f.name === newFile.name && f.size === newFile.size)
        );
      if (files.length) {
        setEventForm((s) => ({ ...s, files: [...s.files, ...files] }));
      }
    }
    el.addEventListener("dragover", onDragOver);
    el.addEventListener("dragleave", onDragLeave);
    el.addEventListener("drop", onDrop);
    return () => {
      el.removeEventListener("dragover", onDragOver);
      el.removeEventListener("dragleave", onDragLeave);
      el.removeEventListener("drop", onDrop);
    };
  }, [eventForm.files]);

  // Drag & Drop (edit)
  useEffect(() => {
    const el = editDropRef.current;
    if (!el) return;
    function onDragOver(e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
      el.classList.add("drag-over");
    }
    function onDragLeave() {
      el.classList.remove("drag-over");
    }
    function onDrop(e) {
      e.preventDefault();
      el.classList.remove("drag-over");
      const files = Array.from(e.dataTransfer.files)
        .filter((f) => f.type.startsWith("image"))
        .filter(
          (newFile) => !editAddFiles.some((f) => f.name === newFile.name && f.size === newFile.size)
        );
      if (files.length) {
        setEditAddFiles((s) => [...s, ...files]);
      }
    }
    el.addEventListener("dragover", onDragOver);
    el.addEventListener("dragleave", onDragLeave);
    el.addEventListener("drop", onDrop);
    return () => {
      el.removeEventListener("dragover", onDragOver);
      el.removeEventListener("dragleave", onDragLeave);
      el.removeEventListener("drop", onDrop);
    };
  }, [editAddFiles]);

  // --- Upload: Event ---
  async function uploadEvent() {
    if (!eventForm.eventName || !eventForm.eventDate) {
      return showAlert("danger", "Event name and date are required");
    }
    if (!eventForm.files.length) {
      return showAlert("danger", "Choose at least one image");
    }

    const fd = new FormData();
    fd.append("eventName", eventForm.eventName);
    fd.append("eventDate", eventForm.eventDate);
    fd.append("eventDescription", eventForm.eventDescription || "");
    eventForm.files.forEach((f) => fd.append("images", f));

    setEventUploadProgress({});
    setEventUploading(true);
    try {
      await uploadGallery.post("/gallery/event", fd, {
        onUploadProgress: (progressEvent) => {
          if (!progressEvent.total) return;
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          const progObj = {};
          eventForm.files.forEach((f) => {
            progObj[f.name] = percent;
          });
          setEventUploadProgress(progObj);
        },
      });
      setEventForm({ eventName: "", eventDate: "", eventDescription: "", files: [] });
      setShowEventPanel(false);
      await fetchItems();
      showAlert("success", "Event uploaded");
    } catch (err) {
      console.error("Upload event failed:", err.response?.data || err.message || err);
      showAlert("danger", `Upload failed: ${err.response?.data?.message || err.message || ""}`);
    } finally {
      setEventUploadProgress({});
      setEventUploading(false);
    }
  }

  // --- Upload: Single ---
  async function uploadSingleImage() {
    if (!singleFile) return showAlert("danger", "Choose a file");
    const fd = new FormData();
    fd.append("image", singleFile);

    setSingleUploadProgress(0);
    setSingleUploading(true);
    try {
      await uploadGallery.post("/gallery/single", fd, {
        onUploadProgress: (e) => {
          if (!e.total) return;
          const p = Math.round((e.loaded * 100) / e.total);
          setSingleUploadProgress(p);
        },
      });
      setSingleFile(null);
      setShowSinglePanel(false);
      await fetchItems();
      showAlert("success", "Image uploaded");
    } catch (err) {
      console.error("Upload single failed:", err.response?.data || err.message || err);
      showAlert("danger", `Upload failed: ${err.response?.data?.message || err.message || ""}`);
    } finally {
      setSingleUploadProgress(0);
      setSingleUploading(false);
    }
  }

  // --- Edit modal logic ---
  function openEdit(item) {
    if (item.type !== "event") {
      showAlert("danger", "Only events can be edited");
      return;
    }
    setEditingItem({
      ...item,
      eventName: item.eventName || "",
      eventDate: item.eventDate ? item.eventDate.split("T")[0] : "",
      eventDescription: item.eventDescription || "",
    });
    setEditAddFiles([]);
    setEditUploadProgress({});
    setShowEditModal(true);
  }

  async function saveEdit() {
    if (!editingItem) return;
    try {
      await uploadGallery.put(`/gallery/event/${editingItem._id}`, {
        eventName: editingItem.eventName,
        eventDate: editingItem.eventDate,
        eventDescription: editingItem.eventDescription,
      });
    } catch (err) {
      console.error("Update meta failed:", err.response?.data || err.message || err);
      showAlert("danger", "Failed to update event details");
      return;
    }

    if (!editAddFiles.length) {
      setShowEditModal(false);
      await fetchItems();
      showAlert("success", "Event updated");
      return;
    }
    const fd = new FormData();
    editAddFiles.forEach((f) => fd.append("images", f));
    setEditUploading(true);
    try {
      await uploadGallery.post(`/gallery/event/${editingItem._id}/images`, fd, {
        onUploadProgress: (e) => {
          if (!e.total) return;
          const percent = Math.round((e.loaded * 100) / e.total);
          const progObj = {};
          editAddFiles.forEach((f) => (progObj[f.name] = percent));
          setEditUploadProgress(progObj);
        },
      });

      setShowEditModal(false);
      setEditAddFiles([]);
      await fetchItems();
      showAlert("success", "Added images to event");
    } catch (err) {
      console.error("Add images to event failed:", err.response?.data || err.message || err);
      showAlert("danger", "Failed to add images to event.");
    } finally {
      setEditUploadProgress({});
      setEditUploading(false);
    }
  }

  // --- Delete operations ---
  async function deleteEvent(id) {
    if (!window.confirm("Delete this entire event (all images)?")) return;
    try {
      await uploadGallery.delete(`/gallery/event/${id}`);
      await fetchItems();
      showAlert("success", "Event deleted");
    } catch (err) {
      console.error("Delete event failed:", err.response?.data || err.message || err);
      showAlert("danger", "Delete failed");
    }
  }

  async function deleteSingle(id) {
    if (!window.confirm("Delete this single image?")) return;
    try {
      await uploadGallery.delete(`/gallery/single/${id}`);
      await fetchItems();
      showAlert("success", "Image deleted");
    } catch (err) {
      console.error("Delete single failed:", err.response?.data || err.message || err);
      showAlert("danger", "Delete failed");
    }
  }

  async function deleteImageFromEvent(eventId, publicId) {
    if (!window.confirm("Delete this image from event?")) return;
    try {
      await uploadGallery.delete(`/gallery/event/${eventId}/image/${publicId}`);
      await fetchItems();
      showAlert("success", "Image deleted from event");
    } catch (err) {
      console.error("Delete image from event failed:", err.response?.data || err.message || err);
      showAlert("danger", "Delete failed");
    }
  }

  // --- Preview modal ---
  function openPreview(img) {
    if (!img) return;
    const src = img.url || img.src || img;
    const lower = String(src).toLowerCase();
    const isVideo = lower.endsWith(".mp4") || lower.endsWith(".webm") || lower.includes("video");
    setPreview({ type: isVideo ? "video" : "image", src, caption: img.caption || "" });
  }
  function closePreview() {
    setPreview(null);
  }

  // Create object URLs safely
  function createObjectURL(file) {
    try {
      const u = URL.createObjectURL(file);
      objectUrlRefs.current.push(u);
      return u;
    } catch {
      return "";
    }
  }

  // --- Render item card ---
  function renderItemCard(item) {
    if (item.type === "event") {
      return (
        <article className="card-advanced" key={item._id}>
          <div className="card-head">
            <div>
              <div className="card-title">{item.eventName}</div>
              <div className="card-sub">{item.eventDate ? new Date(item.eventDate).toLocaleDateString() : ""}</div>
            </div>
            <div className="card-actions">
              <button title="Edit event" onClick={() => openEdit(item)} className="icon-btn">
                <Edit size={16} />
              </button>
              <button title="Delete event" onClick={() => deleteEvent(item._id)} className="icon-btn danger">
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <div className="card-desc">{item.eventDescription}</div>

          <div className="images-grid">
            {item.images?.map((img) => (
              <div className="img-wrap" key={img.public_id}>
                <img
                  src={img.url}
                  alt={img.public_id}
                  onClick={() => openPreview(img)}
                />
                <div className="img-overlay">
                  <button onClick={() => deleteImageFromEvent(item._id, img.public_id)} title="Delete this image" className="img-del">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </article>
      );
    }

    // single
    return (
      <article className="card-advanced single" key={item._id}>
        <div className="card-head">
          <div>
            <div className="card-title">Single Image</div>
            <div className="card-sub">{item.singleImage?.public_id || ""}</div>
          </div>
          <button title="Delete single" onClick={() => deleteSingle(item._id)} className="icon-btn danger">
            <Trash2 size={16} />
          </button>
        </div>

        <div className="single-img-wrap" onClick={() => openPreview(item.singleImage)}>
          <img src={item.singleImage?.url} alt={item.singleImage?.public_id} />
        </div>
      </article>
    );
  }

  // --- JSX return ---
  return (
    <>
      <style>{`
        :root {
          --primary: #6a4ed9;
          --accent: #ff8c42;
          --muted: #6b6b6b;
        }
        * { box-sizing: border-box; }
        body, html, #root { height: 100%; }


        .page-shell {
          display: flex;
          min-height: 100vh;
          background: linear-gradient(135deg,#f3e5f5,#e0f7fa);
        }
        aside.sidebar {
          width: 250px;
          transition: width .28s ease;
        }
        aside.sidebar.closed {
          width: 80px;
        }

        @media (max-width: 600px) {
          aside.sidebar {
            position: fixed;
            z-index: 1000;
            height: 100vh;
            width: 80px;
            left: 0;
          }
          main.main-content {
            margin-left: 80px !important;
            padding: 12px 12px !important;
          }
        }

        main.main-content {
          flex: 1;
          padding: 28px 36px;
          transition: margin-left .32s ease;
        }

        .page-title { font-size: 32px; font-weight: 800; color: var(--primary); }
        .small-muted { color: var(--muted); font-size: 15px; font-weight: 500; }

        .header-row { display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap; }

        .controls { display:flex; gap:10px; align-items:center; flex-wrap:wrap; }
        @media (max-width: 480px) {
          .controls {
            flex-direction: column;
            gap: 10px;
          }
        }

        .search-box { position:relative; }
        .search-box input { padding:10px 12px 10px 36px; min-width:180px; border-radius:8px; border:1px solid rgba(0,0,0,0.08); }
        .search-box .icon { position:absolute; left:10px; top:50%; transform:translateY(-50%); color: #666; }

        .btn { padding:8px 12px; border-radius:8px; border:none; cursor:pointer; font-weight:600; }
        .btn.primary { background:var(--primary); color:#fff; }
        .btn.green { background:#28c76f; color:#fff; }
        .btn.ghost { background:transparent; border:1px solid rgba(0,0,0,0.06); }

        @media (max-width: 480px) {
          .input,
          .btn {
            width: 100%;
            box-sizing: border-box;
          }
        }

        .cards-grid {
          margin-top:18px;
          display:grid;
          grid-template-columns: repeat(auto-fill,minmax(220px,1fr));
          gap:18px;
        }

        /* Card */
        .card-advanced {
          background: linear-gradient(180deg,#ffffff,#fbfbfd);
          border-radius: 12px;
          padding: 14px;
          border: 1px solid rgba(110,100,180,0.06);
          transition: .22s ease;
          box-shadow: 0 6px 20px rgba(25,30,50,0.04);
          display:flex;
          flex-direction:column;
          gap:10px;
          min-height: 200px;
        }
        .card-advanced.single { align-items:stretch; }
        .card-head { display:flex; justify-content:space-between; align-items:flex-start; gap:8px; }
        .card-title { font-weight:700; font-size:16px; }
        .card-sub { font-size:13px; color:var(--muted); margin-top:4px; }
        .card-actions { display:flex; gap:6px; align-items:center; }
        .icon-btn { background:transparent; border:none; padding:6px; border-radius:8px; cursor:pointer; }
        .icon-btn:hover { background: rgba(0,0,0,0.04); }
        .icon-btn.danger { color: #e53935; }

        .card-desc { color: #4b4b4b; font-size:14px; flex:1; }

        .images-grid { display:grid; grid-template-columns:repeat(2, 1fr); gap:8px; margin-top:6px; }
        @media(min-width:720px){ .images-grid { grid-template-columns:repeat(4, 1fr); } }
        @media (max-width: 720px) { .images-grid { grid-template-columns:repeat(2, 1fr); } }
        @media (max-width: 480px) { .images-grid { grid-template-columns: 1fr; } }
        .img-wrap { position:relative; border-radius:8px; overflow:hidden; background:#fafafa; }
        .img-wrap img { width:100%; height:100%; object-fit:cover; display:block; cursor:pointer; min-height:84px; max-height:140px; }
        .img-overlay { position:absolute; inset:0; display:flex; justify-content:flex-end; padding:8px; pointer-events:none; }
        .img-overlay .img-del { pointer-events:auto; opacity:0; transform: translateY(-6px); transition: all .18s ease; }
        .img-wrap:hover .img-overlay .img-del { opacity:1; transform: translateY(0); }

        .single-img-wrap { width:100%; height:220px; overflow:hidden; border-radius:8px; cursor:pointer; background:#fafafa; display:flex; align-items:center; justify-content:center; }
        .single-img-wrap img { width:100%; height:100%; object-fit:cover; }
        @media(max-width:640px){ .single-img-wrap { height:160px; } }

        /* Panels & modals */
        .panel {
          background: #fff;
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 8px 30px rgba(25,30,50,0.06);
          border: 1px solid rgba(0,0,0,0.04);
          margin-bottom: 18px;
        }
        .panel .panel-row { display:flex; gap:10px; flex-wrap:wrap; }
        .panel .input { padding:8px 10px; border-radius:8px; border:1px solid rgba(0,0,0,0.06); min-width:180px; }

        .drop-area { border:2px dashed #e6e7f2; padding:14px; border-radius:10px; text-align:center; cursor:pointer; }
        .drop-area.drag-over { box-shadow:0 6px 18px rgba(106,78,217,0.06); border-color: rgba(106,78,217,0.4); }

        .file-row { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:8px 0; }
        .file-row img { width:64px; height:48px; object-fit:cover; border-radius:6px; }

        .progress { width:100%; background:#f1f1f1; height:8px; border-radius:8px; overflow:hidden; }
        .progress > i { display:block; height:100%; width:0%; background: linear-gradient(90deg, var(--primary), var(--accent)); transition:width .2s ease; }

        /* Edit modal */
        .modal-backdrop-custom {
          position: fixed;
          inset: 0;
          background: rgba(7,8,12,0.36);
          backdrop-filter: blur(4px);
          display:flex;
          justify-content:center;
          align-items:center;
          padding:12px;
          z-index:2000;
        }
        .modal-glass {
          width:100%;
          max-width:900px;
          background: rgba(255,255,255,.98);
          padding:18px;
          border-radius:16px;
          box-shadow: 0 10px 50px rgba(25,30,50,0.09);
        }

        /* Preview modal */
        .preview-backdrop { position:fixed; inset:0; display:flex; align-items:center; justify-content:center; z-index:3000; }
        .preview-backdrop .preview-bg { position:absolute; inset:0; background:rgba(0,0,0,0.6); }
        .preview-content { position:relative; z-index:2; max-width:90vw; max-height:80vh; overflow:auto; }

        /* Pagination */
        .pager { display:flex; align-items:center; gap:10px; justify-content:space-between; margin-top:18px; flex-wrap:wrap; }


        /* Responsive tweaks */
        @media(max-width:992px){
          main.main-content { padding:22px 18px; }
          .search-box input { min-width:140px; }
        }
        @media(max-width:640px){
          main.main-content { padding:12px 12px; }
          .page-title { font-size:20px; text-align:center; }
          .cards-grid { grid-template-columns: 1fr; }
          .single-img-wrap { height:160px; }
        }
        @media (max-width: 640px) {
          .page-title {
            font-size: 24px;
          }
          .header-row {
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
          }
          .card-title {
            font-size: 14px;
          }
        }
      `}</style>

      <div className="page-shell">
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? "" : "closed"}`} >
          <Sidebar onToggle={setSidebarOpen} />
        </aside>

        <main
          className="main-content"
          style={{ marginLeft: sidebarOpen ? "250px" : "80px" }}
        >
          {/* Header */}
          <div className="header-row mb-3">
            <div>
              <h2 className="page-title">Gallery Management</h2>
              <div className="small-muted">Manage events and single images — upload, edit and remove.</div>
            </div>

            <div className="controls">
              <div className="search-box">
                <input
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                  placeholder="Search events or images..."
                />
                <div className="icon"><SearchIcon size={16} /></div>
              </div>

              <select
                value={filterType}
                onChange={(e) => { setFilterType(e.target.value); setPage(1); }}
                className="input"
                style={{ padding: "8px 10px", borderRadius: 8 }}
              >
                <option value="all">All</option>
                <option value="event">Events</option>
                <option value="single">Single Images</option>
              </select>

              <button className="btn primary" onClick={() => setShowEventPanel((s) => !s)}>
                <Plus size={14} style={{ verticalAlign: "middle", marginRight: 6 }} /> Add Event
              </button>

              <button className="btn" style={{ background: "#2e9f72", color: "#fff" }} onClick={() => setShowSinglePanel((s) => !s)}>
                <Upload size={14} style={{ verticalAlign: "middle", marginRight: 6 }} /> Add Single
              </button>
            </div>
          </div>

          {alert && <div style={{ marginBottom: 12 }} className={`panel`}>{alert.message}</div>}

          {/* Event upload panel */}
          {showEventPanel && (
            <div className="panel">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <h3 style={{ margin: 0 }}>Create Event (multiple images)</h3>
                <button className="icon-btn" onClick={() => setShowEventPanel(false)}><X /></button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                <input
                  placeholder="Event name"
                  value={eventForm.eventName}
                  onChange={(e) => setEventForm((s) => ({ ...s, eventName: e.target.value }))}
                  className="input"
                />
                <input
                  type="date"
                  value={eventForm.eventDate}
                  onChange={(e) => setEventForm((s) => ({ ...s, eventDate: e.target.value }))}
                  className="input"
                />
                <input
                  placeholder="Short description"
                  value={eventForm.eventDescription}
                  onChange={(e) => setEventForm((s) => ({ ...s, eventDescription: e.target.value }))}
                  className="input"
                />
              </div>

              <div ref={eventDropRef} className="drop-area" style={{ marginTop: 12 }}>
                <p className="small-muted" style={{ margin: 0 }}>Drag & drop images here, or click to select</p>

                <input
                  id="eventFilesInput"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files)
                      .filter((f) => f.type.startsWith("image"))
                      .filter(
                        (newFile) =>
                          !eventForm.files.some((f) => f.name === newFile.name && f.size === newFile.size)
                      );
                    if (files.length) {
                      setEventForm((s) => ({ ...s, files: [...s.files, ...files] }));
                    }
                  }}
                  className="hidden"
                  style={{ display: "none" }}
                />
                <label htmlFor="eventFilesInput" style={{ display: "inline-block", marginTop: 10, padding: "8px 12px", borderRadius: 8, background: "#f3f4f8", cursor: "pointer" }}>Choose files</label>

                {eventForm.files.length > 0 && (
                  <div style={{ marginTop: 12, textAlign: "left" }}>
                    {eventForm.files.map((f) => {
                      const prev = createObjectURL(f);
                      return (
                        <div key={f.name + f.size} className="file-row">
                          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                            <img src={prev} alt={f.name} />
                            <div>
                              <div style={{ fontWeight: 700 }}>{f.name}</div>
                              <div style={{ fontSize: 12, color: "#777" }}>{Math.round(f.size / 1024)} KB</div>
                            </div>
                          </div>
                          <div style={{ width: 160 }}>
                            <div className="progress"><i style={{ width: `${eventUploadProgress[f.name] || 0}%` }} /></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button className="btn primary" onClick={uploadEvent} disabled={eventUploading}>
                    <Upload size={14} style={{ marginRight: 6 }} /> {eventUploading ? "Uploading..." : "Upload"}
                  </button>
                  <button className="btn ghost" onClick={() => setEventForm({ eventName: "", eventDate: "", eventDescription: "", files: [] })} disabled={eventUploading}>
                    Reset
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Single upload panel */}
          {showSinglePanel && (
            <div className="panel">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <h3 style={{ margin: 0 }}>Upload Single Image</h3>
                <button className="icon-btn" onClick={() => setShowSinglePanel(false)}><X /></button>
              </div>

              <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                <input
                  id="singleFileInput"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSingleFile(e.target.files[0])}
                  disabled={singleUploading}
                  style={{ display: "inline-block" }}
                />
                <div>
                  <button className="btn" style={{ background: "#2e9f72", color: "#fff" }} onClick={uploadSingleImage} disabled={singleUploading}>
                    <Upload size={14} style={{ marginRight: 6 }} /> {singleUploading ? "Uploading..." : "Upload"}
                  </button>
                </div>
              </div>

              {singleFile && (
                <div style={{ marginTop: 12, display: "flex", gap: 12, alignItems: "center" }}>
                  <img src={createObjectURL(singleFile)} alt="preview" style={{ width: 96, height: 72, objectFit: "cover", borderRadius: 8 }} />
                  <div style={{ width: 220 }}>
                    <div className="progress"><i style={{ width: `${singleUploadProgress}%` }} /></div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Edit modal */}
          {showEditModal && editingItem && (
            <div className="modal-backdrop-custom" role="dialog">
              <div className="modal-glass">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <h3 style={{ margin: 0 }}>Edit Event</h3>
                  <button className="icon-btn" onClick={() => { setShowEditModal(false); setEditAddFiles([]); }}><X /></button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                  <input className="input" value={editingItem.eventName} onChange={e => setEditingItem(s => ({ ...s, eventName: e.target.value }))} />
                  <input type="date" className="input" value={editingItem.eventDate} onChange={e => setEditingItem(s => ({ ...s, eventDate: e.target.value }))} />
                  <input className="input" value={editingItem.eventDescription} onChange={e => setEditingItem(s => ({ ...s, eventDescription: e.target.value }))} />
                </div>

                <div ref={editDropRef} className="drop-area" style={{ marginTop: 10 }}>
                  <p className="small-muted" style={{ margin: 0 }}>Drag & drop additional images to add to this event (or click to select)</p>

                  <input
                    id="editFilesInput"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={e => {
                      const files = Array.from(e.target.files)
                        .filter((f) => f.type.startsWith("image"))
                        .filter(
                          (newFile) => !editAddFiles.some((f) => f.name === newFile.name && f.size === newFile.size)
                        );
                      if (files.length) setEditAddFiles(s => [...s, ...files]);
                    }}
                    style={{ display: "none" }}
                  />
                  <label htmlFor="editFilesInput" style={{ display: "inline-block", marginTop: 10, padding: "8px 12px", borderRadius: 8, background: "#f3f4f8", cursor: "pointer" }}>Choose files</label>

                  {editAddFiles.length > 0 && (
                    <div style={{ marginTop: 12, textAlign: "left" }}>
                      {editAddFiles.map((f) => {
                        const prev = createObjectURL(f);
                        return (
                          <div key={f.name + f.size} className="file-row">
                            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                              <img src={prev} alt={f.name} />
                              <div>
                                <div style={{ fontWeight: 700 }}>{f.name}</div>
                                <div style={{ fontSize: 12, color: "#777" }}>{Math.round(f.size / 1024)} KB</div>
                              </div>
                            </div>
                            <div style={{ width: 160 }}>
                              <div className="progress"><i style={{ width: `${editUploadProgress[f.name] || 0}%` }} /></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
                  <button className="btn ghost" onClick={() => { setShowEditModal(false); setEditAddFiles([]); }}>Cancel</button>
                  <button className="btn primary" onClick={saveEdit} disabled={editUploading}>{editUploading ? "Uploading..." : "Save changes"}</button>
                </div>
              </div>
            </div>
          )}

          {/* Grid */}
          <div className="cards-grid">
            {loading ? (
              <div className="panel">Loading…</div>
            ) : pageItems.length === 0 ? (
              <div className="panel small-muted">No items found.</div>
            ) : (
              pageItems.map((it) => <div key={it._id}>{renderItemCard(it)}</div>)
            )}
          </div>

          {/* Pagination */}
          <div className="pager">
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button className="icon-btn" onClick={() => setPage(p => Math.max(1, p - 1))}><ChevronLeft size={16} /></button>
              <div>Page {page} of {totalPages}</div>
              <button className="icon-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))}><ChevronRight size={16} /></button>
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <div className="small-muted">Items per page</div>
              <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }} className="input">
                {PAGE_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Preview modal */}
          {preview && (
            <div className="preview-backdrop">
              <div className="preview-bg" onClick={closePreview}></div>
              <div className="preview-content">
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
                  <button className="icon-btn" onClick={closePreview}><X /></button>
                </div>
                <div style={{ background: "#000", padding: 8, borderRadius: 10 }}>
                  {preview.type === "image" ? (
                    <img src={preview.src} alt={preview.caption} style={{ width: "100%", borderRadius: 8 }} />
                  ) : (
                    <video controls style={{ width: "100%", borderRadius: 8 }}>
                      <source src={preview.src} />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
                {preview.caption && <div style={{ marginTop: 8, textAlign: "center", color: "#fff" }}>{preview.caption}</div>}
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

/* Small helper component kept at the bottom */
export function ProgressBar({ percent = 0 }) {
  return (
    <div className="progress" style={{ height: 8, borderRadius: 8 }}>
      <i style={{ width: `${Math.min(100, percent)}%` }} />
    </div>
  );
}
