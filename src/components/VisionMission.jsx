import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const VisionMission = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Navbar />

      <style>{`
        :root {
          --vm-purple: #6a3bbb;
          --vm-purple-light: #9b6fe9;
          --vm-glow: rgba(155, 111, 233, 0.25);
          --vm-text-dark: #222;
        }

        /* =============================
           HERO SECTION
        ============================= */
        .vm-header {
          width: 100%;
          min-height: 260px;
          padding: 80px 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          color: white;
          position: relative;
          background-image: url("https://content.jdmagicbox.com/comp/machilipatnam/r8/9999p8672.8672.161001121858.x5r8/catalogue/s-s-r-degree-college-jagannadhapuram-machilipatnam-colleges-gbp74u3.jpg");
          background-size: cover;
          background-position: center;
          overflow: hidden;
        }

        .vm-header::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to right,
            rgba(27, 79, 114, 0.6),
            rgba(46, 134, 193, 0.4)
          );
          z-index: 1;
          animation: vmFadeOverlay 1s ease forwards;
        }

        .vm-title {
          position: relative;
          z-index: 2;
          font-size: 40px;
          font-weight: 800;
          letter-spacing: 1px;
          opacity: 0;
          animation: vmFadeTitle 1s ease forwards;
          animation-delay: 0.2s;
        }

        @keyframes vmFadeOverlay {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes vmFadeTitle {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* =============================
           WRAPPER CONTENT
        ============================= */
        .vm-wrapper {
          max-width: 1200px;
          margin: 50px auto;
          padding: 20px;
          display: flex;
          gap: 40px;
          opacity: 0;
          animation: vmFadeUp 1s ease forwards;
        }

        @keyframes vmFadeUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        /* Column Styling */
        .vm-col {
          flex: 1;
          position: relative;
          padding: 25px 20px;
        }

        .vm-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle, var(--vm-glow), transparent);
          filter: blur(45px);
          z-index: -1;
        }

        .vm-heading {
          font-size: 28px;
          font-weight: 700;
          color: var(--vm-purple);
          margin-bottom: 12px;
          animation: vmFadeRight 1s ease forwards;
        }

        @keyframes vmFadeRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .vm-text {
          font-size: 17px;
          color: #444;
          line-height: 1.7;
          text-align: justify;
          animation: vmFadeLeft 1s ease forwards;
        }

        @keyframes vmFadeLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        /* =============================
           SKELETON LOADING
        ============================= */
        .skeleton {
          background: linear-gradient(90deg, #e3e3e3 0%, #f7f7f7 50%, #e3e3e3 100%);
          background-size: 200% 100%;
          animation: vmSkeleton 1.2s linear infinite;
          border-radius: 8px;
        }

        @keyframes vmSkeleton {
          0% { background-position: 150% 0; }
          100% { background-position: -150% 0; }
        }

        .sk-line {
          height: 18px;
          width: 100%;
          margin-bottom: 15px;
        }

        /* =============================
           RESPONSIVE ADJUSTMENTS
        ============================= */
        @media (max-width: 900px) {
          .vm-wrapper {
            flex-direction: column;
            text-align: center;
          }

          .vm-col {
            text-align: left;
          }
        }

        @media (max-width: 480px) {
          .vm-title {
            font-size: 30px;
          }

          .vm-heading {
            font-size: 24px;
          }

          .vm-text {
            font-size: 16px;
          }
        }
      `}</style>

      {/* ================= HEADER ================= */}
      <div className="vm-header">
        <h1 className="vm-title">Vision & Mission</h1>
      </div>

      {/* ================= SKELETON ================= */}
      {loading ? (
        <div className="vm-wrapper">
          <div className="vm-col">
            <div className="skeleton sk-line" style={{ width: "50%" }} />
            <div className="skeleton sk-line" />
            <div className="skeleton sk-line" />
            <div className="skeleton sk-line" style={{ width: "80%" }} />
            <div className="skeleton sk-line" style={{ width: "60%" }} />
          </div>

          <div className="vm-col">
            <div className="skeleton sk-line" style={{ width: "50%" }} />
            <div className="skeleton sk-line" />
            <div className="skeleton sk-line" />
            <div className="skeleton sk-line" style={{ width: "70%" }} />
            <div className="skeleton sk-line" style={{ width: "60%" }} />
          </div>
        </div>
      ) : (
        <>
          {/* ================= CONTENT ================= */}
          <div className="vm-wrapper">

            {/* Vision */}
            <div className="vm-col">
              <div className="vm-glow"></div>
              <h2 className="vm-heading">Our Vision</h2>
              <p className="vm-text">
                To emerge as a premier educational institution that nurtures
                responsible, skilled, and globally competent individuals.
                Our vision is to foster innovation, creativity, academic excellence,
                and lifelong learning through a holistic educational framework.
              </p>
            </div>

            {/* Mission */}
            <div className="vm-col">
              <div className="vm-glow"></div>
              <h2 className="vm-heading">Our Mission</h2>
              <p className="vm-text">
                ● Deliver high-quality education that strengthens academic
                understanding and personal development.
                <br /><br />
                ● Build leadership, discipline, and problem-solving skills among students.
                <br /><br />
                ● Provide practical exposure, modern learning resources,
                and mentorship for overall growth.
                <br /><br />
                ● Instill ethical values, social responsibility, and a spirit of service
                toward the community.
                <br /><br />
                ● Empower students with relevant skills to succeed in higher education,
                careers, and life.
              </p>
            </div>

          </div>

          <Footer />
        </>
      )}
    </>
  );
};

export default VisionMission;
