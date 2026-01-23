import React from "react";

const steps = [
  {
    title: "Budding Student",
    text: "Discover academic interests, adapt to college life, and build strong foundations.",
    img: "https://images.pexels.com/photos/2774546/pexels-photo-2774546.jpeg",
  },
  {
    title: "Beyond the Curriculum",
    text: "Engage in academics, labs, seminars, and co-curricular activities.",
    img: "https://images.pexels.com/photos/1181715/pexels-photo-1181715.jpeg",
  },
  {
    title: "Hands-on Learning",
    text: "Apply knowledge through internships, projects, and real-world exposure.",
    img: "https://images.pexels.com/photos/3184312/pexels-photo-3184312.jpeg",
  },
  {
    title: "Career Transition",
    text: "Placement training, mentoring, and professional opportunities begin.",
    img: "https://images.pexels.com/photos/6146973/pexels-photo-6146973.jpeg",
  },
];

const StudentsJourney = () => {
  return (
    <>
      <style>{`
        :root {
          --journey-accent: #a69cf8;
        }

        /* ================= SECTION ================= */
        .journey-section {
          padding: 90px 16px;
          background: linear-gradient(180deg, #f7f8ff, #ffffff);
          font-family: 'Inter', sans-serif;
        }

        .journey-header {
          text-align: center;
          max-width: 900px;
          margin: 0 auto 70px;
        }

        .journey-header h2 {
          font-size: 34px;
          font-weight: 800;
          color: var(--text-main);
          margin-bottom: 12px;
        }

        .journey-line {
          width: 70px;
          height: 3px;
          margin: 0 auto;
          border-radius: 999px;
          background: var(--journey-accent);
        }

        .journey-header p {
          margin-top: 18px;
          font-size: 15.5px;
          line-height: 1.75;
          color: var(--text-muted);
        }

        /* ================= DESKTOP TIMELINE ================= */
        .journey-grid {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 36px;
        }

        .journey-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 26px;
          text-align: center;
          border: 1.2px solid var(--journey-accent);

          box-shadow:
            0 10px 22px rgba(0,0,0,0.08),
            0 14px 30px rgba(166,156,248,0.18);

          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .journey-card:hover {
          transform: translateY(-6px);
          box-shadow:
            0 16px 36px rgba(166,156,248,0.35),
            0 22px 48px rgba(0,0,0,0.12);
        }

        .journey-img {
          width: 150px;
          height: 150px;
          border-radius: 14px;
          object-fit: cover;
          margin: -60px auto 16px;

          border: 5px solid #ffffff;
          outline: 2px solid var(--journey-accent);

          box-shadow: 0 12px 26px rgba(0,0,0,0.18);
        }

        .journey-title {
          font-size: 18px;
          font-weight: 800;
          color: var(--text-main);
          margin-bottom: 6px;
        }

        .journey-text {
          font-size: 14.5px;
          color: var(--text-muted);
          line-height: 1.6;
        }

        /* ================= RESPONSIVE ================= */
        @media (max-width: 1024px) {
          .journey-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 32px;
          }
          .journey-img {
            margin-top: 0;
          }
        }

        @media (max-width: 640px) {
          .journey-grid {
            display: flex;
            gap: 18px;
            overflow-x: auto;
            padding-bottom: 10px;
            scroll-snap-type: x mandatory;
          }

          .journey-grid::-webkit-scrollbar {
            display: none;
          }

          .journey-card {
            min-width: 260px;
            scroll-snap-align: center;
          }

          .journey-img {
            width: 160px;
            height: 160px;
          }
        }
      `}</style>

      <section className="journey-section">
        <div className="journey-header">
          <h2>Student Journey at SSR</h2>
          <div className="journey-line" />
          <p>
            From the first step into campus life to launching successful careers,
            SSR Degree College supports students at every stage of their journey.
          </p>
        </div>

        <div className="journey-grid">
          {steps.map((step, idx) => (
            <div key={idx} className="journey-card">
              <img src={step.img} alt={step.title} className="journey-img" />
              <div className="journey-title">{step.title}</div>
              <div className="journey-text">{step.text}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default StudentsJourney;
