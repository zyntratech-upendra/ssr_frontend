import React, { useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

/*
  HomeWelcomeSection.jsx
  - High-end, responsive welcome section
  - Interactive 3D-like image card (mouse tilt)
  - Decorative animated blobs & subtle parallax
  - Optional <model-viewer> 3D embed (replace placeholder GLB URL)
*/

const HomeWelcomeSection = () => {
  const cardRef = useRef(null);

  // load model-viewer only if not loaded (for 3D model embed)
  useEffect(() => {
    if (!window.customElements || !window.customElements.get("model-viewer")) {
      const s = document.createElement("script");
      s.type = "module";
      s.src = "https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js";
      document.head.appendChild(s);
    }
  }, []);

  // mouse tilt effect for the image/card
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    let rect = null;
    function onMove(e) {
      rect = el.getBoundingClientRect();
      const clientX = e.clientX ?? (e.touches && e.touches[0].clientX);
      const clientY = e.clientY ?? (e.touches && e.touches[0].clientY);
      if (!clientX || !clientY) return;

      const x = (clientX - rect.left) / rect.width;
      const y = (clientY - rect.top) / rect.height;
      const rotateY = (x - 0.5) * 18; // degrees
      const rotateX = (0.5 - y) * 12;
      const translateZ = 10 + (0.5 - Math.abs(x - 0.5)) * 18;

      el.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${translateZ}px)`;
      el.style.boxShadow = `${-rotateY * 0.7}px ${Math.abs(rotateX) * 1.5 + 10}px 40px rgba(12,18,30,0.15)`;
    }

    function onLeave() {
      el.style.transform = `perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0px)`;
      el.style.boxShadow = `0 18px 40px rgba(12,18,30,0.08)`;
    }

    el.addEventListener("mousemove", onMove);
    el.addEventListener("touchmove", onMove, { passive: true });
    el.addEventListener("mouseleave", onLeave);
    el.addEventListener("touchend", onLeave);

    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      el.removeEventListener("touchend", onLeave);
    };
  }, []);

  return (
    <>
      <style>{`
        :root{
          --accent: #c399ee;        /* primary green */
          --accent-2: #ff7b29;     /* supporting orange for CTAs */
          --muted: #7a54b1;
          --bg: linear-gradient(180deg, #fbfbff 0%, #f6f8fb 100%);
        }

        .welcome-hero {
          background: var(--bg);
          padding: 72px 18px;
          position: relative;
          overflow: hidden;
        }

        /* Decorative floating shapes */
        .blob {
          position: absolute;
          filter: blur(36px) saturate(120%);
          opacity: 0.25;
          transform: translate3d(0,0,0);
          pointer-events: none;
        }
        .blob.a { width: 420px; height: 420px; left: -80px; top: -60px; background: radial-gradient(circle at 30% 30%, #7A54B1, transparent 35%); animation: floatA 8s ease-in-out infinite; }
        .blob.b { width: 360px; height: 360px; right: -100px; bottom: -60px; background: radial-gradient(circle at 60% 60%, #0bb394, transparent 40%); animation: floatB 10s ease-in-out infinite; }
        @keyframes floatA { 0% { transform: translateY(0px); } 50% { transform: translateY(18px); } 100% { transform: translateY(0px); } }
        @keyframes floatB { 0% { transform: translateY(0px) rotate(0); } 50% { transform: translateY(-20px) rotate(8deg); } 100% { transform: translateY(0px) rotate(0); } }

        /* layout */
        .welcome-grid {
          display: grid;
          grid-template-columns: 1fr 520px;
          gap: 36px;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
        }

        @media (max-width: 992px) {
          .welcome-grid { grid-template-columns: 1fr; padding: 0 12px; }
        }

        /* left content card */
        .hero-card {
          background: linear-gradient(180deg, rgba(255,255,255,0.95), rgba(250,250,254,0.95));
          border-radius: 16px;
          padding: 34px;
          box-shadow: 0 20px 50px rgba(12,18,30,0.06);
          border: 1px solid rgba(120,130,160,0.06);
          position: relative;
          overflow: visible;
        }

        .kicker {
          display: inline-flex;
          gap: 8px;
          align-items: center;
          padding: 6px 10px;
          background: rgba(109, 10, 158, 0.23);
          color: var(--accent);
          font-weight: 700;
          border-radius: 999px;
          font-size: 13px;
          letter-spacing: 0.2px;
          margin-bottom: 12px;
        }

        .hero-title {
          font-size: 34px;
          line-height: 1.05;
          margin: 6px 0 12px;
          color: #0f1723;
          font-weight: 800;
        }

        .hero-sub {
          color: var(--muted);
          font-size: 15px;
          line-height: 1.7;
          margin-bottom: 18px;
          max-width: 60ch;
        }

        .hero-ctas {
          display: flex;
          gap: 12px;
          margin-top: 16px;
        }

        .btn-primary-hero {
          background: linear-gradient(90deg, var(--accent), #7a54b1);
          border: none;
          color: white;
          padding: 10px 20px;
          border-radius: 10px;
          font-weight: 700;
          box-shadow: 0 10px 30px rgba(11,179,148,0.14);
          transition: transform .18s ease, box-shadow .18s ease;
        }
        .btn-primary-hero:hover { transform: translateY(-4px) scale(1.01); box-shadow: 0 18px 40px rgba(11,179,148,0.18); }

        .btn-secondary-hero {
          background: transparent;
          border-radius: 10px;
          padding: 10px 18px;
          border: 1px solid rgba(15,23,35,0.06);
          color: var(--muted);
          font-weight: 700;
        }

        /* right visual column */
        .visual-wrap {
          display: flex;
          gap: 18px;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        /* stylized 3D card container */
        .visual-card {
          width: 100%;
          max-width: 520px;
          border-radius: 18px;
          background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
          padding: 18px;
          box-shadow: 0 28px 60px rgba(11,20,36,0.08);
          border: 1px solid rgba(120,130,160,0.06);
          transform-style: preserve-3d;
          transition: transform 300ms cubic-bezier(.2,.9,.25,1), box-shadow 300ms;
          will-change: transform;
        }

        .visual-media {
          display: block;
          width: 100%;
          border-radius: 12px;
          overflow: hidden;
          background: linear-gradient(180deg, rgba(11,179,148,0.06), rgba(122,84,177,0.04));
          aspect-ratio: 16 / 10;
          position: relative;
        }

        .visual-media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: translateZ(30px) scale(1.02);
          transition: transform 400ms ease;
        }

        /* small badge overlay */
        .badge {
          position: absolute;
          left: 14px;
          top: 14px;
          background: white;
          padding: 8px 10px;
          border-radius: 999px;
          box-shadow: 0 8px 20px rgba(12,18,30,0.06);
          display: inline-flex;
          gap: 8px;
          align-items: center;
          font-weight: 700;
          color: #333;
        }

        .badge .dot { width:10px; height:10px; border-radius:50%; background:var(--accent); box-shadow: 0 4px 10px rgba(11,179,148,0.12); }

        /* subtle hover sparkle */
        .visual-card:hover .visual-media img { transform: translateZ(46px) scale(1.04); }

        /* caption / small stats */
        .visual-meta {
          display:flex;
          gap:12px;
          justify-content: center;
          margin-top:12px;
          color: var(--muted);
          font-weight:600;
        }

        .visual-meta .stat { display:flex; flex-direction:column; align-items:center; font-size:13px; }

        /* model-viewer fallback styling */
        model-viewer { width:100%; height:100%; background:transparent; border-radius:12px; }

        /* responsive tweaks */
        @media (max-width: 768px) {
          .hero-title { font-size: 26px; text-align:center; }
          .hero-sub { text-align:center; margin-left:auto; margin-right:auto; }
          .hero-card { padding: 26px; }
          .visual-meta { flex-direction:row; gap:8px; justify-content: center; }
        }

        /* tiny polished micro-interactions */
        .hero-card:before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 16px;
          pointer-events: none;
          background: linear-gradient(180deg, rgba(255,255,255,0.02), transparent 30%);
          mix-blend-mode: overlay;
        }

      `}</style>

      <section className="welcome-hero" aria-label="Welcome section">
        {/* decorative blobs */}
        <div className="blob a" aria-hidden />
        <div className="blob b" aria-hidden />

        <div className="welcome-grid">
          {/* LEFT — content */}
          <div className="hero-card" role="article" aria-labelledby="hero-title">
            <div className="kicker">SSR College • Since 2001</div>

            <h1 id="hero-title" className="hero-title">Welcome to S S R Degree College</h1>

            <p className="hero-sub">
              SSR Degree College empowers students from rural and semi-urban communities
              with industry-aligned curricula, hands-on learning and holistic development.
              We blend disciplined academic rigor with vibrant campus life to produce
              career-ready, socially responsible graduates.
            </p>

            <div className="hero-ctas">
              <a href="/about" className="btn btn-primary-hero" role="button" aria-label="Read about SSR">Read More</a>
              <a href="/admissions" className="btn btn-secondary-hero" role="button" aria-label="Admissions">Admissions</a>
            </div>

            {/* micro features — 3 columns */}
            <div style={{ display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap" }}>
              <div style={{ minWidth: 160, background: "rgba(11,179,148,0.04)", borderRadius: 12, padding: 12, fontWeight:700, color:"#0b6e5f" }}>
                Accredited • NAAC A
              </div>
              <div style={{ minWidth: 160, background: "rgba(122,84,177,0.04)", borderRadius: 12, padding: 12, fontWeight:700, color:"#5b3b87" }}>
                20+ Departments
              </div>
              <div style={{ minWidth: 160, background: "rgba(255,123,41,0.04)", borderRadius: 12, padding: 12, fontWeight:700, color:"#a84d1b" }}>
                Placement Support
              </div>
            </div>
          </div>

          {/* RIGHT — visual column */}
          <div className="visual-wrap">
            <div className="visual-card" ref={cardRef}>
              <div className="visual-media" aria-hidden>
                <span className="badge"><span className="dot" /> Top-rated</span>

                {/* Option A: Image (interactive tilt) */}
                <img
                  src="https://content.jdmagicbox.com/comp/machilipatnam/r8/9999p8672.8672.161001121858.x5r8/catalogue/s-s-r-degree-college-jagannadhapuram-machilipatnam-colleges-gbp74u3.jpg"
                  alt="SSR College campus view"
                  loading="lazy"
                />

                {/* Option B: Uncomment to use an interactive 3D model instead of the image.
                   Replace `path/to/your-model.glb` with your model URL (publicly hosted).
                   If you use model-viewer, the @google/model-viewer script will be autoloaded above.
                */}
                {/*
                <model-viewer
                  alt="SSR 3D model"
                  src="path/to/your-model.glb"
                  ios-src=""
                  ar
                  ar-modes="webxr scene-viewer quick-look"
                  camera-controls
                  auto-rotate
                  reveal="interaction"
                  style={{ width: "100%", height: "100%", borderRadius: 12 }}
                ></model-viewer>
                */}
              </div>

              <div className="visual-meta" aria-hidden>
                <div className="stat"><span style={{fontSize:16,fontWeight:800}}>1200+</span><small style={{color:"var(--muted)"}}>Students</small></div>
                <div className="stat"><span style={{fontSize:16,fontWeight:800}}>95%</span><small style={{color:"var(--muted)"}}>Placement Rate</small></div>
                <div className="stat"><span style={{fontSize:16,fontWeight:800}}>150+</span><small style={{color:"var(--muted)"}}>Faculty hrs</small></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomeWelcomeSection;
