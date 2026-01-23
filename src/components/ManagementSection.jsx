import React from "react";

const people = [
  {
    id: 1,
    name: "Sri S R Prakash Rao",
    role: "Chairman",
    img: "/images/manager1.jpg",
    bio: "Visionary leader with 25+ years of experience in educational administration, focused on quality education and inclusive growth."
  },
  {
    id: 2,
    name: "Dr. P Sai Ram",
    role: "Vice Chairman",
    img: "/images/manager2.jpg",
    bio: "Academic strategist promoting faculty excellence, research culture, and strong industry collaboration."
  },
  {
    id: 3,
    name: "Sri A M Viswanath",
    role: "Secretary",
    img: "/images/manager3.jpg",
    bio: "Leads institutional operations and long-term infrastructure planning with precision and integrity."
  },
  {
    id: 4,
    name: "Sri K Srilokanath",
    role: "Joint Secretary",
    img: "/images/manager4.jpg",
    bio: "Committed to student welfare, outreach programs, and strengthening community engagement."
  },
  {
    id: 5,
    name: "Dr. V R Srikanth",
    role: "Principal",
    img: "/images/principal.jpg",
    bio: "Academic head guiding curriculum development, assessment reforms, and student success initiatives."
  },
  {
    id: 6,
    name: "Dr. S N Rao",
    role: "Director",
    img: "/images/director.jpg",
    bio: "Oversees research, innovation labs, and strategic industry partnerships at SSR College."
  },
];

const ManagementSection = () => {
  return (
    <>
      <style>{`
        :root {
          --accent-outline: #a69cf8;
        }

        /* ================= SECTION ================= */
        .mgmt-section {
          padding: 90px 16px;
          background: linear-gradient(180deg, var(--primary-soft), #ffffff);
          font-family: 'Inter', sans-serif;
        }

        .mgmt-header {
          text-align: center;
          max-width: 900px;
          margin: 0 auto 60px;
        }

        .mgmt-header h2 {
          font-size: 34px;
          font-weight: 800;
          color: var(--text-main);
          margin-bottom: 12px;
        }

        .mgmt-header .line {
          width: 70px;
          height: 3px;
          margin: 0 auto;
          border-radius: 999px;
          background: var(--accent-outline);
        }

        .mgmt-header p {
          margin-top: 18px;
          font-size: 15.5px;
          line-height: 1.75;
          color: var(--text-muted);
        }

        /* ================= GRID ================= */
        .mgmt-grid {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 36px;
        }

        @media (max-width: 992px) {
          .mgmt-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .mgmt-grid {
            grid-template-columns: 1fr;
          }
        }

        /* ================= FLIP CARD ================= */
        .mgmt-card {
          perspective: 1200px;
        }

        .mgmt-card-inner {
          position: relative;
          height: 420px;
          transform-style: preserve-3d;
          transition: transform 0.7s ease;
        }

        .mgmt-card:hover .mgmt-card-inner {
          transform: rotateY(180deg);
        }

        /* Disable flip on touch devices */
        @media (hover: none) {
          .mgmt-card-inner {
            transform: none !important;
            height: auto;
          }
        }

        .mgmt-face {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          border-radius: 20px;
          background: #ffffff;

          /* THIN OUTLINE – ALL SIDES */
          border: 1.2px solid var(--accent-outline);

          /* Soft elevation */
          box-shadow:
            0 10px 22px rgba(0,0,0,0.08),
            0 14px 30px rgba(166,156,248,0.18);

          padding: 34px 26px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;

          transition: box-shadow 0.3s ease, transform 0.3s ease;
        }

        .mgmt-card:hover .mgmt-face {
          box-shadow:
            0 16px 34px rgba(166,156,248,0.35),
            0 22px 48px rgba(0,0,0,0.14);
        }

        /* ================= FRONT ================= */
        .mgmt-front img {
          width: 128px;
          height: 128px;
          border-radius: 50%;
          object-fit: cover;
          margin-bottom: 16px;

          border: 5px solid #ffffff;
          outline: 2px solid var(--accent-outline);

          box-shadow: 0 12px 26px rgba(0,0,0,0.18);
        }

        .mgmt-front h4 {
          font-size: 19px;
          font-weight: 800;
          color: var(--text-main);
          margin-bottom: 6px;
        }

        .mgmt-front span {
          font-size: 14.5px;
          font-weight: 700;
          color: var(--accent-outline);
          letter-spacing: 0.3px;
        }

        /* ================= BACK ================= */
        .mgmt-back {
          transform: rotateY(180deg);
          justify-content: space-between;
        }

        .mgmt-back h4 {
          font-size: 18.5px;
          font-weight: 800;
          color: var(--text-main);
        }

        .mgmt-back p {
          font-size: 14.5px;
          line-height: 1.65;
          color: var(--text-muted);
          margin: 18px 0 26px;
        }

        .mgmt-btn {
          padding: 10px 26px;
          border-radius: 10px;
          border: 1.2px solid var(--accent-outline);
          background: transparent;
          color: var(--accent-outline);
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .mgmt-btn:hover {
          background: var(--accent-outline);
          color: #ffffff;
          box-shadow: 0 8px 22px rgba(166,156,248,0.45);
        }

        /* ================= MOBILE FALLBACK ================= */
        @media (hover: none) {
          .mgmt-face {
            position: static;
            height: auto;
            box-shadow: 0 10px 22px rgba(166,156,248,0.22);
          }

          .mgmt-back {
            transform: none;
            margin-top: 14px;
          }
        }
      `}</style>

      <section className="mgmt-section">
        <div className="mgmt-header">
          <h2>SSR Educational Society</h2>
          <div className="line" />
          <p>
            The SSR Educational Society is dedicated to nurturing responsible,
            skilled, and future-ready graduates through academic excellence,
            leadership development, and community-focused initiatives.
          </p>
        </div>

        <div className="mgmt-grid">
          {people.map((p) => (
            <div key={p.id} className="mgmt-card">
              <div className="mgmt-card-inner">
                {/* FRONT */}
                <div className="mgmt-face mgmt-front">
                  <img src={p.img} alt={p.name} />
                  <h4>{p.name}</h4>
                  <span>{p.role}</span>
                </div>

                {/* BACK */}
                <div className="mgmt-face mgmt-back">
                  <h4>{p.name}</h4>
                  <p>{p.bio}</p>
                  <button
                    className="mgmt-btn"
                    onClick={() => (window.location.href = `/management/${p.id}`)}
                  >
                    Read More →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default ManagementSection;
