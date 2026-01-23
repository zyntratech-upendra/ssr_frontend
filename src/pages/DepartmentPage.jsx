import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDepartmentById } from "../services/departmentService";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const DepartmentPage = () => {
  const { id } = useParams();
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDepartment();
    // eslint-disable-next-line
  }, [id]);

  const loadDepartment = async () => {
    try {
      const res = await getDepartmentById(id);
      setDepartment(res.data);
    } catch (error) {
      console.error("Error loading department:", error);
      setDepartment(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ padding: 90, textAlign: "center" }}>
          <h2 style={{ color: "#7A54B1" }}>Loading Department…</h2>
        </div>
        <Footer />
      </>
    );
  }

  if (!department) {
    return (
      <>
        <Navbar />
        <div style={{ padding: 90, textAlign: "center" }}>
          <h2 style={{ color: "#dc2626" }}>Department Not Found</h2>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      {/* ================= STYLES ================= */}
      <style>{`
        :root {
          --primary: #7A54B1;
          --primary-dark: #643E94;
          --primary-soft: #F4F1FB;
          --text-main: #0f172a;
          --text-muted: #64748b;
          --border: #e5e7eb;
          --shadow-soft: 0 20px 45px rgba(0,0,0,0.12);
        }

        body {
          font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont,
            'Segoe UI', Roboto, Arial, sans-serif;
        }

        /* ================= HERO ================= */
        .dept-hero {
          position: relative;
          min-height: 360px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          text-align: center;
          color: #fff;
        }

        .dept-hero img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.65);
        }

        .dept-hero::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(122,84,177,0.9),
            rgba(122,84,177,0.6)
          );
        }

        .dept-hero-content {
          position: relative;
          z-index: 2;
          max-width: 900px;
          padding: 0 22px;
        }

        .dept-title {
          font-size: 44px;
          font-weight: 800;
          margin-bottom: 10px;
        }

        .dept-sub {
          font-size: 16px;
          line-height: 1.8;
          color: #f5f3ff;
          max-width: 720px;
          margin: 0 auto 16px;
        }

        .dept-tags {
          display: flex;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .tag {
          background: rgba(255,255,255,0.18);
          padding: 8px 14px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 600;
        }

        /* ================= MAIN ================= */
        .dept-container {
          max-width: 1200px;
          margin: 70px auto;
          padding: 0 20px;
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 42px;
        }

        .card {
          background: #fff;
          border-radius: 18px;
          padding: 28px;
          border: 1px solid var(--border);
          box-shadow: var(--shadow-soft);
        }

        .card h3,
        .card h4 {
          margin-top: 0;
          color: var(--text-main);
        }

        .dept-description {
          color: var(--text-muted);
          font-size: 15px;
          line-height: 1.85;
        }

        /* ================= BATCHES ================= */
        .batch-grid {
          margin-top: 20px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 14px;
        }

        .batch-card {
          padding: 16px;
          border-radius: 14px;
          background: linear-gradient(180deg, #fff, var(--primary-soft));
          border: 1px solid var(--border);
          transition: 0.25s ease;
        }

        .batch-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 18px 38px rgba(122,84,177,0.18);
        }

        .batch-name {
          font-weight: 700;
          color: var(--text-main);
        }

        .batch-meta {
          font-size: 13px;
          color: var(--text-muted);
          margin-top: 6px;
        }

        /* ================= SIDE ================= */
        .stat-box {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 14px;
        }

        .stat-num {
          width: 58px;
          height: 58px;
          border-radius: 14px;
          background: linear-gradient(
            135deg,
            var(--primary),
            var(--primary-dark)
          );
          color: white;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        .stat-label {
          font-weight: 600;
          color: var(--text-main);
        }

        .stat-sub {
          font-size: 13px;
          color: var(--text-muted);
        }

        .btn-primary {
          width: 100%;
          padding: 13px;
          border-radius: 12px;
          background: linear-gradient(
            135deg,
            var(--primary),
            var(--primary-dark)
          );
          border: none;
          color: white;
          font-weight: 700;
          margin-top: 12px;
          transition: 0.25s ease;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 36px rgba(122,84,177,0.35);
        }

        .btn-outline {
          width: 100%;
          padding: 13px;
          border-radius: 12px;
          background: white;
          border: 1px solid var(--border);
          color: var(--primary);
          font-weight: 700;
          margin-top: 10px;
        }

        /* ================= RESPONSIVE ================= */
        @media (max-width: 992px) {
          .dept-container {
            grid-template-columns: 1fr;
          }
          .dept-title {
            font-size: 34px;
          }
        }

        @media (max-width: 480px) {
          .dept-title {
            font-size: 26px;
          }
          .card {
            padding: 22px;
          }
        }
      `}</style>

      {/* ================= HERO ================= */}
      <section className="dept-hero">
        <img
          src={department.departmentImage}
          alt={department.departmentName}
        />
        <div className="dept-hero-content">
          <h1 className="dept-title">{department.departmentName}</h1>
          <p className="dept-sub">{department.description}</p>
          <div className="dept-tags">
            <span className="tag">ID: {department.departmentId}</span>
            <span className="tag">
              Created: {new Date(department.createdAt).toLocaleDateString()}
            </span>
            <span className="tag">
              Status: {department.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <main className="dept-container">
        {/* LEFT */}
        <div>
          <div className="card">
            <h3>About the Department</h3>
            <p className="dept-description">{department.description}</p>

            <h4 style={{ marginTop: 26 }}>Batches</h4>
            <div className="batch-grid">
              {department.batches?.length ? (
                department.batches.map((b) => (
                  <div key={b.batchId} className="batch-card">
                    <div className="batch-name">{b.batchName}</div>
                    <div className="batch-meta">
                      Batch ID: {b.batchId}
                    </div>
                  </div>
                ))
              ) : (
                <p className="dept-description">No batches available.</p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <aside>
          <div className="card">
            <h4>Department Overview</h4>

            <div className="stat-box">
              <div className="stat-num">
                {department.batches?.length || 0}
              </div>
              <div>
                <div className="stat-label">Batches</div>
                <div className="stat-sub">Active & archived</div>
              </div>
            </div>

            <div className="stat-box">
              <div className="stat-num">—</div>
              <div>
                <div className="stat-label">Students</div>
                <div className="stat-sub">Estimated</div>
              </div>
            </div>

            <button
              className="btn-primary"
              onClick={() =>
                window.scrollTo({
                  top: document.body.scrollHeight,
                  behavior: "smooth",
                })
              }
            >
              Apply to Department
            </button>

            <button
              className="btn-outline"
              onClick={() => (window.location.href = "/contact")}
            >
              Contact Department
            </button>
          </div>
        </aside>
      </main>

      <Footer />
    </>
  );
};

export default DepartmentPage;
