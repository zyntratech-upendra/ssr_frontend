// src/pages/CodingProblems.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";
import ProblemList from "../pages/studentSections/ProblemList";
import { fetchCodingProblems } from "../services/codingService";

function CodingProblems() {
  const [selectedPlatform, setSelectedPlatform] = useState("leetcode");
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    fetchProblems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlatform]);

  const fetchProblems = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchCodingProblems(selectedPlatform);
      
      
      const data =  response;
      setProblems(data);
    } catch (error) {
      console.error("Error fetching problems:", error);
      setError("Failed to load problems. Please try again.");
      setProblems([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        :root {
          --primary: #2563eb;
          --primary-soft: #eff6ff;
          --muted: #6b7280;
          --card-bg: #ffffff;
        }

        .coding-page {
          display: flex;
          min-height: 100vh;
          background: radial-gradient(circle at top left,#eff6ff,#e0f2fe);
        }

        .coding-main {
          flex: 1;
          padding: 24px 32px;
          transition: margin-left .32s ease;
        }

        .coding-header-title {
          font-size: 28px;
          font-weight: 800;
          color: #111827;
          margin-bottom: 6px;
        }

        .coding-header-sub {
          color: var(--muted);
          font-size: 14px;
        }

        .coding-card {
          max-width: 1100px;
          margin: 16px auto 0;
          background: var(--card-bg);
          border-radius: 16px;
          padding: 20px 22px;
          box-shadow: 0 14px 35px rgba(15,23,42,0.14);
        }

        .platform-selector {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 20px;
        }

        .platform-btn {
          padding: 10px 22px;
          font-size: 14px;
          font-weight: 600;
          border-radius: 999px;
          border: 2px solid #e5e7eb;
          background: #ffffff;
          color: #374151;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 10px rgba(15,23,42,0.05);
          transition: background .18s ease, color .18s ease, border-color .18s ease, transform .12s ease, box-shadow .18s ease;
        }

        .platform-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 18px rgba(15,23,42,0.10);
        }

        .platform-btn.active {
          background: var(--primary);
          border-color: var(--primary);
          color: #ffffff;
        }

        .platform-pill {
          font-size: 11px;
          padding: 2px 8px;
          border-radius: 999px;
          background: rgba(255,255,255,0.15);
        }

        .status-box {
          text-align: center;
          padding: 40px 16px;
          border-radius: 12px;
          background: #f3f4f6;
          color: #6b7280;
          font-size: 15px;
        }

        .status-box.error {
          background: #fef2f2;
          color: #b91c1c;
        }

        .status-box button {
          margin-top: 12px;
        }

        @media (max-width: 992px) {
          .coding-main { padding: 20px 16px; }
        }

        @media (max-width: 768px) {
          .coding-main { padding: 16px 10px; }
          .coding-header-title { font-size: 22px; text-align:center; }
          .coding-header-sub { text-align:center; }
        }

        @media (max-width: 480px) {
          .coding-main { padding: 10px 6px; }
          .coding-card { padding: 16px 14px; border-radius: 12px; }
        }
      `}</style>

      <div className="coding-page">
        <Sidebar onToggle={setSidebarOpen} />

        <main
          className="coding-main"
          style={{ marginLeft: sidebarOpen ? "250px" : "80px" }}
        >
          <div className="mb-3">
            <h2 className="coding-header-title">Coding Problem Explorer</h2>
            <p className="coding-header-sub mb-0">
              Practice curated coding questions from multiple platforms.
            </p>
          </div>

          <section className="coding-card">
            {/* Platform selector */}
            <div className="platform-selector">
              <button
                type="button"
                onClick={() => setSelectedPlatform("leetcode")}
                className={
                  "platform-btn" +
                  (selectedPlatform === "leetcode" ? " active" : "")
                }
              >
                <span>LeetCode</span>
                {selectedPlatform === "leetcode" && (
                  <span className="platform-pill">Popular DSA</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setSelectedPlatform("codechef")}
                className={
                  "platform-btn" +
                  (selectedPlatform === "codechef" ? " active" : "")
                }
              >
                <span>CodeChef</span>
                {selectedPlatform === "codechef" && (
                  <span className="platform-pill">Contests</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setSelectedPlatform("hackerrank")}
                className={
                  "platform-btn" +
                  (selectedPlatform === "hackerrank" ? " active" : "")
                }
              >
                <span>HackerRank</span>
                {selectedPlatform === "hackerrank" && (
                  <span className="platform-pill">Basics</span>
                )}
              </button>
            </div>

            {/* States & list */}
            {loading && (
              <div className="status-box">
                <p className="mb-0">Loading problems...</p>
              </div>
            )}

            {error && !loading && (
              <div className="status-box error">
                <p className="mb-2">{error}</p>
                <button
                  type="button"
                  onClick={fetchProblems}
                  className="btn btn-sm btn-primary"
                >
                  Retry
                </button>
              </div>
            )}

            {!loading && !error && problems.length > 0 && (
              <ProblemList
                problems={problems}
                platform={selectedPlatform}
              />
            )}

            {!loading && !error && problems.length === 0 && (
              <div className="status-box">
                <p className="mb-0">No problems found for this platform.</p>
              </div>
            )}
          </section>
        </main>
      </div>
    </>
  );
}

export default CodingProblems;
