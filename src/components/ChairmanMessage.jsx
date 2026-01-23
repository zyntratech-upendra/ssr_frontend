import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const ChairmanMessage = () => {
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
          --chairman-blue: #1b4f72;
          --chairman-blue-light: #2e86c1;
          --chairman-gold: #d4ac0d;
          --text-dark: #1c1c1c;
        }

        /* =============================
           HERO BACKGROUND SECTION
        ============================= */
        .cm-header {
          width: 100%;
          min-height: 260px;
          padding: 70px 15px;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          color: white;
          background-image: url("https://content.jdmagicbox.com/comp/machilipatnam/r8/9999p8672.8672.161001121858.x5r8/catalogue/s-s-r-degree-college-jagannadhapuram-machilipatnam-colleges-gbp74u3.jpg");
          background-size: cover;
          background-position: center;
          position: relative;
          overflow: hidden;
        }

        .cm-header::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to right,
            rgba(27, 79, 114, 0.6),
            rgba(46, 134, 193, 0.4)
          );
          z-index: 1;
          animation: fadeOverlay 1s ease forwards;
        }

        .cm-title {
          position: relative;
          z-index: 2;
          font-size: 32px;
          font-weight: 800;
          letter-spacing: 1px;
          opacity: 0;
          animation: fadeTitle 1s ease forwards;
        }

        @keyframes fadeOverlay {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fadeTitle {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* =============================
           MAIN CONTENT AREA
        ============================= */
        .cm-wrapper {
          max-width: 1250px;
          margin: 40px auto;
          padding: 20px;
          display: flex;
          gap: 35px;
          opacity: 0;
          animation: fadeUp 1s ease forwards;
        }

        @keyframes fadeUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        /* Image Section */
        .cm-img-box {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
        }

        .cm-img {
          width: 100%;
          max-width: 380px;
          border-radius: 14px;
          box-shadow: 0px 8px 20px rgba(0,0,0,0.18);
          opacity: 0;
          animation: fadeLeft 1s ease forwards;
        }

        @keyframes fadeLeft {
          from { opacity: 0; transform: translateX(-25px); }
          to { opacity: 1; transform: translateX(0); }
        }

        /* Glow */
        .cm-glow {
          position: absolute;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, rgba(46,134,193,0.25), transparent);
          filter: blur(40px);
          z-index: -1;
        }

        /* Text Section */
        .cm-content {
          flex: 2;
          min-width: 280px;
          opacity: 0;
          animation: fadeRight 1s ease forwards;
          animation-delay: 0.2s;
        }

        @keyframes fadeRight {
          from { opacity: 0; transform: translateX(25px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .cm-heading {
          font-size: 26px;
          font-weight: 700;
          color: var(--chairman-blue);
          margin-bottom: 12px;
        }

        .cm-quote {
          font-size: 17px;
          font-style: italic;
          border-left: 4px solid var(--chairman-gold);
          padding-left: 15px;
          margin-bottom: 20px;
          color: var(--chairman-blue-light);
        }

        .cm-text {
          font-size: 16px;
          line-height: 1.7;
          color: #333;
          margin-bottom: 15px;
          text-align: justify;
        }

        .cm-name {
          font-size: 20px;
          font-weight: bold;
          margin-top: 20px;
          color: var(--chairman-blue);
        }

        .cm-designation {
          font-size: 14px;
          color: #777;
        }

        /* =============================
           SKELETON LOADING
        ============================= */
        .skeleton {
          background: linear-gradient(90deg, #e3e3e3 0%, #f2f2f2 50%, #e3e3e3 100%);
          background-size: 200% 100%;
          animation: skLoading 1.2s infinite linear;
          border-radius: 8px;
        }

        @keyframes skLoading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .sk-img {
          width: 100%;
          height: 330px;
          max-width: 380px;
        }

        .sk-line {
          height: 16px;
          margin-bottom: 12px;
        }

        /* =============================
           FULL RESPONSIVE FIXES
        ============================= */

        /* Tablets & Below */
        @media (max-width: 992px) {
          .cm-wrapper {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }

          .cm-content {
            text-align: justify;
            width: 100%;
          }

          .cm-img {
            max-width: 65%;
          }
        }

        /* Mobile Devices */
        @media (max-width: 600px) {
          .cm-header {
            min-height: 220px;
            padding: 60px 10px;
          }

          .cm-title {
            font-size: 26px;
          }

          .cm-wrapper {
            padding: 10px;
          }

          .cm-img {
            max-width: 90%;
          }

          .cm-heading {
            font-size: 22px;
          }

          .cm-text {
            font-size: 15px;
          }
        }

        /* Smallest Devices */
        @media (max-width: 400px) {
          .cm-title {
            font-size: 22px;
          }

          .cm-img {
            max-width: 95%;
          }

          .cm-heading {
            font-size: 20px;
          }
        }
      `}</style>

      {/* ================= HEADER SECTION ================= */}
      <div className="cm-header">
        <h1 className="cm-title">Chairman's Message</h1>
      </div>

      {/* ================= SKELETON ================= */}
      {loading ? (
        <div className="cm-wrapper">
          <div className="cm-img-box">
            <div className="skeleton sk-img"></div>
          </div>

          <div className="cm-content">
            <div className="skeleton sk-line" style={{ width: "60%" }} />
            <div className="skeleton sk-line" />
            <div className="skeleton sk-line" />
            <div className="skeleton sk-line" style={{ width: "80%" }} />
            <div className="skeleton sk-line" style={{ width: "50%" }} />
          </div>
        </div>
      ) : (
        <>
          {/* ================= CONTENT ================= */}
          <div className="cm-wrapper">

            <div className="cm-img-box">
              <div className="cm-glow" />
              <img
                src="https://content.jdmagicbox.com/v2/comp/machilipatnam/r8/9999p8672.8672.161001121858.x5r8/catalogue/s-s-r-degree-college-buttaipet-machilipatnam-colleges-rnnhw7xlyq.jpg?imwidth=463.3333333333333"
                className="cm-img"
                alt="Chairman"
              />
            </div>

            <div className="cm-content">
              <h2 className="cm-heading">Message From Our Chairman</h2>

              <p className="cm-quote">
                "Education is the most powerful tool that transforms individuals, families, and entire communities."
              </p>

              <p className="cm-text">
                It gives me immense pleasure to welcome you to SSR Degree College — an institution
                committed to academic excellence, discipline, and holistic student development.
                Since its establishment, SSR has strived to provide quality higher
                education that empowers students to excel in their chosen fields.
              </p>

              <p className="cm-text">
                At SSR, we believe education extends far beyond textbooks. We aim to shape responsible,
                confident, and talented individuals capable of contributing meaningfully to society.
                Our experienced faculty guide and support students in every step of their journey.
              </p>

              <p className="cm-text">
                Along with academics, we encourage participation in cultural, sports, and community 
                activities that broaden perspectives and enhance life skills. Our institution 
                actively partners with organizations to offer training, internships, and placement support.
              </p>

              <p className="cm-text">
                I warmly invite you to be a part of the SSR family and experience an educational journey
                that fosters growth, innovation, and lifelong learning. Together, let us build a brighter future.
              </p>

              <p className="cm-name">Sri V. Ramesh</p>
              <p className="cm-designation">Chairman, SSR Degree College</p>
            </div>
          </div>

          <Footer />
        </>
      )}
    </>
  );
  
};

export default ChairmanMessage;
