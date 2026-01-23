import React, { useEffect, useState } from "react";

const RecruitersSection = () => {
  const [logos, setLogos] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(API_URL + "/api/recruiters")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setLogos(data.data);
      });
  }, []);

  const activeLogos = logos.filter((l) => l.isActive === true);
  const scrollingLogos = [...activeLogos, ...activeLogos];

  return (
    <>
      <style>{`
        :root {
          --recruiter-accent: #a69cf8;
        }

        /* ================= SECTION ================= */
        .recruiter-section {
          padding: 80px 12px;
          background: linear-gradient(180deg, #ffffff, #f7f8ff);
          text-align: center;
          overflow: hidden;
          font-family: 'Inter', sans-serif;
        }

        .recruiter-title {
          font-size: 32px;
          font-weight: 800;
          color: var(--text-main);
          margin-bottom: 10px;
        }

        .recruiter-line {
          width: 70px;
          height: 3px;
          background: var(--recruiter-accent);
          margin: 0 auto 40px;
          border-radius: 999px;
        }

        /* ================= SLIDER ================= */
        .recruiter-slider {
          width: 100%;
          overflow: hidden;
          position: relative;
        }

        .recruiter-track {
          display: flex;
          align-items: center;
          gap: 70px;
          animation: recruiterScroll 26s linear infinite;
          will-change: transform;
        }

        .recruiter-slider:hover .recruiter-track {
          animation-play-state: paused;
        }

        @keyframes recruiterScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }

        /* ================= LOGOS (COLOR) ================= */
        .recruiter-logo {
          height: 78px;
          object-fit: contain;
          opacity: 1;
          transition: transform 0.3s ease, filter 0.3s ease;
        }

        .recruiter-logo:hover {
          transform: translateY(-6px) scale(1.05);
          filter: drop-shadow(0 8px 18px rgba(0,0,0,0.18));
        }

        /* ================= RESPONSIVE ================= */
        @media (max-width: 1024px) {
          .recruiter-track { gap: 55px; }
          .recruiter-logo { height: 64px; }
        }

        @media (max-width: 768px) {
          .recruiter-title { font-size: 26px; }
          .recruiter-logo { height: 52px; }
          .recruiter-track { gap: 45px; }
        }

        @media (max-width: 480px) {
          .recruiter-title { font-size: 22px; }
          .recruiter-logo { height: 46px; }
          .recruiter-track { gap: 36px; }
        }
      `}</style>

      <section className="recruiter-section">
        <h2 className="recruiter-title">Our Recruiters</h2>
        <div className="recruiter-line" />

        <div className="recruiter-slider">
          <div className="recruiter-track">
            {scrollingLogos.map((logo, index) => (
              <img
                key={index}
                src={logo.imageUrl}
                alt={logo.companyName}
                className="recruiter-logo"
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default RecruitersSection;
