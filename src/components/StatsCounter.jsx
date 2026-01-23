import React, { useEffect, useRef, useState } from "react";
import {
  FaUniversity,
  FaUserGraduate,
  FaBookOpen,
  FaAward,
} from "react-icons/fa";

const StatsCounter = () => {
  const ref = useRef(null);
  const [startCount, setStartCount] = useState(false);

  const [counts, setCounts] = useState({
    placements: 0,
    students: 0,
    books: 0,
    triumphs: 0,
  });

  const targetValues = {
    placements: 98.7,
    students: 10000,
    books: 7500,
    triumphs: 99,
  };

  /* ---------------- VISIBILITY OBSERVER ---------------- */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setStartCount(true),
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
  }, []);

  /* ---------------- COUNTER ANIMATION ---------------- */
  useEffect(() => {
    if (!startCount) return;

    const duration = 1800;
    const fps = 60;
    const steps = duration / (1000 / fps);
    let step = 0;

    const animate = () => {
      step++;
      setCounts({
        placements: (targetValues.placements / steps) * step,
        students: Math.floor((targetValues.students / steps) * step),
        books: Math.floor((targetValues.books / steps) * step),
        triumphs: Math.floor((targetValues.triumphs / steps) * step),
      });

      if (step < steps) requestAnimationFrame(animate);
    };

    animate();
  }, [startCount]);

  return (
    <>
      <style>{`
        :root {
          --stats-accent: #a69cf8;
        }

        /* ================= SECTION ================= */
        .stats-section {
          padding: 80px 16px;
          background: linear-gradient(180deg, #f7f8ff, #ffffff);
        }

        .stats-container {
          max-width: 1200px;
          margin: auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 32px;
        }

        /* ================= CARD ================= */
        .stat-card {
          background: #ffffff;
          border-radius: 18px;
          padding: 28px 22px;
          display: flex;
          align-items: center;
          gap: 18px;

          border: 1.2px solid var(--stats-accent);
          box-shadow:
            0 10px 22px rgba(0,0,0,0.08),
            0 14px 30px rgba(166,156,248,0.18);

          transition: transform 0.3s ease, box-shadow 0.3s ease;
          opacity: 0;
          transform: translateY(20px);
          animation: fadeUp 0.8s ease forwards;
        }

        .stat-card:hover {
          transform: translateY(-6px);
          box-shadow:
            0 16px 36px rgba(166,156,248,0.35),
            0 22px 48px rgba(0,0,0,0.12);
        }

        @keyframes fadeUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* ================= ICON ================= */
        .stat-icon {
          font-size: 44px;
          color: var(--stats-accent);
          flex-shrink: 0;
          opacity: 0;
          animation: iconFade 0.9s ease forwards;
        }

        @keyframes iconFade {
          from {
            opacity: 0;
            transform: scale(0.85);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* ================= TEXT ================= */
        .stat-value {
          font-size: 30px;
          font-weight: 800;
          color: var(--text-main);
          margin: 0;
        }

        .stat-label {
          font-size: 14.5px;
          color: var(--text-muted);
          margin: 2px 0 0;
          font-weight: 600;
        }

        /* ================= RESPONSIVE ================= */
        @media (max-width: 992px) {
          .stats-container {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .stats-container {
            grid-template-columns: 1fr;
          }
          .stat-card {
            flex-direction: column;
            text-align: center;
            gap: 14px;
          }
          .stat-icon {
            font-size: 40px;
          }
          .stat-value {
            font-size: 26px;
          }
        }
      `}</style>

      <section className="stats-section" ref={ref}>
        <div className="stats-container">
          <div className="stat-card">
            <FaUniversity className="stat-icon" />
            <div>
              <p className="stat-value">{counts.placements.toFixed(1)}%</p>
              <p className="stat-label">Placements</p>
            </div>
          </div>

          <div className="stat-card">
            <FaUserGraduate className="stat-icon" />
            <div>
              <p className="stat-value">
                {counts.students >= 10000 ? "10k+" : counts.students}
              </p>
              <p className="stat-label">Total Students</p>
            </div>
          </div>

          <div className="stat-card">
            <FaBookOpen className="stat-icon" />
            <div>
              <p className="stat-value">
                {counts.books >= 7500 ? "7500+" : counts.books}
              </p>
              <p className="stat-label">Library Books</p>
            </div>
          </div>

          <div className="stat-card">
            <FaAward className="stat-icon" />
            <div>
              <p className="stat-value">
                {counts.triumphs >= 99 ? "99+" : counts.triumphs}
              </p>
              <p className="stat-label">Student Achievements</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default StatsCounter;
