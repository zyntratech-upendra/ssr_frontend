import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const AboutUs = () => {
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
          --abt-purple: #6a3bbb;
          --abt-purple-light: #9b6fe9;
          --abt-glow: rgba(155, 111, 233, 0.25);
          --abt-text-dark: #222;
        }

        /* =============================
           HEADER SECTION
        ============================= */
        .abt-header {
          width: 100%;
          min-height: 260px;
          padding: 80px 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          color: white;
          position: relative;
          overflow: hidden;

          background-image: url("https://content.jdmagicbox.com/comp/machilipatnam/r8/9999p8672.8672.161001121858.x5r8/catalogue/s-s-r-degree-college-jagannadhapuram-machilipatnam-colleges-gbp74u3.jpg");
          background-size: cover;
          background-position: center;
        }

        .abt-header::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to right,
            rgba(27, 79, 114, 0.6),
            rgba(46, 134, 193, 0.4)
          );
          animation: abtFadeOverlay 1s ease forwards;
          z-index: 1;
        }

        .abt-title {
          position: relative;
          z-index: 2;
          font-size: 32px;
          font-weight: 650;
          letter-spacing: 1px;
          opacity: 0;
          animation: abtFadeTitle 1s ease forwards;
          animation-delay: 0.2s;
        }

        .abt-sub {
          font-size: 16px;
          opacity: 0.95;
          margin-top: 10px;
          position: relative;
          z-index: 2;
          opacity: 0;
          animation: abtFadeTitle 1s ease forwards;
          animation-delay: 0.35s;
        }

        @keyframes abtFadeOverlay {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes abtFadeTitle {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* =============================
           MAIN CONTENT
        ============================= */
        .abt-wrapper {
          max-width: 1200px;
          margin: 50px auto;
          padding: 20px;
          display: flex;
          gap: 40px;
          opacity: 0;
          animation: abtFadeUp 1s ease forwards;
        }

        @keyframes abtFadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .abt-img-box {
          flex: 1;
          position: relative;
        }

        .abt-img {
          width: 100%;
          max-width: 450px;
          border-radius: 15px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
          opacity: 0;
          transform: translateX(-20px);
          animation: abtFadeLeft 1s ease forwards;
          animation-delay: 0.25s;
        }

        @keyframes abtFadeLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .abt-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle, var(--abt-glow), transparent);
          filter: blur(45px);
          z-index: -1;
        }

        .abt-content {
          flex: 2;
          opacity: 0;
          animation: abtFadeRight 1s ease forwards;
          animation-delay: 0.35s;
        }

        @keyframes abtFadeRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .abt-text {
          font-size: 17px;
          line-height: 1.8;
          color: #444;
          margin-bottom: 20px;
          text-align: justify;
        }

        /* =============================
           SKELETON LOADING
        ============================= */
        .skeleton {
          background: linear-gradient(90deg, #e3e3e3 0%, #f7f7f7 50%, #e3e3e3 100%);
          background-size: 200% 100%;
          animation: abtSkel 1.2s linear infinite;
          border-radius: 10px;
        }

        @keyframes abtSkel {
          0% { background-position: 150% 0; }
          100% { background-position: -150% 0; }
        }

        .sk-img {
          width: 100%;
          max-width: 450px;
          height: 320px;
        }

        .sk-line {
          height: 18px;
          width: 100%;
          margin-bottom: 15px;
        }

        /* =============================
           RESPONSIVE DESIGN
        ============================= */
        @media (max-width: 900px) {
          .abt-wrapper {
            flex-direction: column;
            text-align: center;
          }
          .abt-img {
            max-width: 80%;
            margin: auto;
          }
          .abt-content {
            text-align: left;
          }
        }

        @media (max-width: 480px) {
          .abt-title { font-size: 30px; }
          .abt-text { font-size: 16px; }
        }
      `}</style>

      {/* ================= HEADER ================= */}
      <div className="abt-header">
        <div>
          <h1 className="abt-title">About SSR Degree College</h1>
          <p className="abt-sub">Empowering students through quality education</p>
        </div>
      </div>

      {/* ================= LOADING ================= */}
      {loading ? (
        <div className="abt-wrapper">
          <div className="abt-img-box">
            <div className="skeleton sk-img"></div>
          </div>

          <div className="abt-content">
            <div className="skeleton sk-line" style={{ width: "70%" }} />
            <div className="skeleton sk-line" />
            <div className="skeleton sk-line" />
            <div className="skeleton sk-line" style={{ width: "85%" }} />
            <div className="skeleton sk-line" style={{ width: "60%" }} />
          </div>
        </div>
      ) : (
        <>
          {/* ================= CONTENT ================= */}
          <div className="abt-wrapper">

            {/* Image */}
            <div className="abt-img-box">
              <div className="abt-glow" />
              <img
                src="https://content.jdmagicbox.com/comp/machilipatnam/r8/9999p8672.8672.161001121858.x5r8/catalogue/s-s-r-degree-college-jagannadhapuram-machilipatnam-colleges-gbp74u3.jpg?imwidth=463.3333333333333"
                className="abt-img"
                alt="Campus"
              />
            </div>

            {/* Text Content */}
            <div className="abt-content">
              <p className="abt-text">
                SSR Degree College is committed to shaping the future of young minds through 
                quality education, discipline, and value-based learning. Our institution blends 
                academic excellence with modern learning methodologies to prepare students for 
                successful careers and meaningful lives.
              </p>

              <p className="abt-text">
                Equipped with experienced faculty, a supportive learning environment, and 
                state-of-the-art facilities, the college focuses on nurturing every student’s 
                intellectual and personal growth. Various academic, cultural, and sports 
                activities create a balanced and enriching campus life.
              </p>

              <p className="abt-text">
                At SSR, we strongly believe in fostering innovation, critical thinking, and 
                social responsibility. Our constant effort is to inspire students to become 
                responsible citizens and accomplished professionals.
              </p>
            </div>
          </div>

          <Footer />
        </>
      )}
    </>
  );
};

export default AboutUs;
