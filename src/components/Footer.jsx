import React from "react";
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
} from "lucide-react";

const Footer = () => {
  const fullAddress = `SSR Degree College
#25/586, opp. KDCC Bank, Jaganadha Puram,
Machilipatnam, Andhra Pradesh 521001`;

  const quickLinks = ["About SSR", "Courses", "Admissions", "Placements"];
  const usefulLinks = [
    "Student Portal",
    "Faculty Login",
    "Examination Cell",
    "Library",
  ];

  return (
    <footer className="ssr-footer">
      <style>{`
        :root {
          --footer-accent: #c399ee;
          --footer-accent-soft: rgba(195,153,238,0.12);
        }

        /* ================= FOOTER BASE ================= */
        .ssr-footer {
          background: linear-gradient(
            180deg,
            var(--footer-accent-soft),
            #ffffff
          );
          border-top: 1px solid rgba(195,153,238,0.35);
          padding: 70px 0 25px;
          color: var(--text-main);
          font-family: 'Inter', system-ui, sans-serif;
        }

        .ssr-footer .container {
          max-width: 1200px;
          margin: auto;
          padding: 0 20px;
        }

        /* ================= GRID ================= */
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 2fr;
          gap: 40px;
        }

        /* ================= BRAND ================= */
        .footer-brand {
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }

        .footer-logo {
          width: 64px;
          height: 64px;
          border-radius: 14px;
          background: var(--footer-accent);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 800;
          font-size: 24px;
          flex-shrink: 0;
          box-shadow: 0 10px 30px rgba(195,153,238,0.45);
        }

        .footer-brand h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 800;
        }

        .footer-brand p {
          margin: 6px 0 0;
          font-size: 14px;
          color: var(--text-muted);
          max-width: 360px;
          line-height: 1.6;
        }

        /* ================= SOCIAL ================= */
        .footer-social {
          display: flex;
          gap: 10px;
          margin-top: 18px;
          flex-wrap: wrap;
        }

        .social-btn {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          border: 1px solid rgba(195,153,238,0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--footer-accent);
          background: white;
          transition: all 0.25s ease;
        }

        .social-btn:hover {
          background: var(--footer-accent);
          color: white;
          transform: translateY(-3px);
          box-shadow: 0 10px 24px rgba(195,153,238,0.5);
        }

        /* ================= COLUMNS ================= */
        .footer-col h4 {
          font-size: 15px;
          margin-bottom: 14px;
          font-weight: 700;
        }

        .footer-col ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-col li {
          margin-bottom: 10px;
        }

        .footer-col a {
          text-decoration: none;
          color: var(--text-muted);
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .footer-col a svg {
          color: var(--footer-accent);
        }

        .footer-col a:hover {
          color: var(--footer-accent);
        }

        /* ================= CONTACT CARD ================= */
        .contact-card {
          border: 1px solid rgba(195,153,238,0.35);
          border-radius: 14px;
          padding: 18px;
          background: white;
        }

        .contact-item {
          display: flex;
          gap: 12px;
          margin-bottom: 14px;
          font-size: 14px;
          color: var(--text-muted);
          line-height: 1.6;
        }

        .contact-item svg {
          color: var(--footer-accent);
          flex-shrink: 0;
          margin-top: 2px;
        }

        .contact-item a {
          color: var(--text-muted);
          text-decoration: none;
        }

        .contact-item a:hover {
          color: var(--footer-accent);
        }

        /* ================= FOOTER BOTTOM ================= */
        .footer-bottom {
          margin-top: 40px;
          padding-top: 18px;
          border-top: 1px solid rgba(195,153,238,0.35);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 14px;
          font-size: 14px;
          color: var(--text-muted);
        }

        .footer-bottom-links {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .footer-bottom a {
          color: var(--text-muted);
          text-decoration: none;
        }

        .footer-bottom a:hover {
          color: var(--footer-accent);
        }

        /* ================= RESPONSIVE ================= */
        @media (max-width: 992px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 576px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }

          .footer-brand {
            flex-direction: column;
          }

          .footer-logo {
            width: 56px;
            height: 56px;
          }

          .footer-bottom {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>

      <div className="container">
        <div className="footer-grid">
          {/* BRAND */}
          <div>
            <div className="footer-brand">
              <div className="footer-logo">S</div>
              <div>
                <h3>SSR Degree College</h3>
                <p>
                  Committed to academic excellence and holistic development,
                  empowering students for a successful future.
                </p>
              </div>
            </div>

            <div className="footer-social">
              <a className="social-btn" href="#"><Facebook size={16} /></a>
              <a className="social-btn" href="#"><Twitter size={16} /></a>
              <a className="social-btn" href="#"><Linkedin size={16} /></a>
              <a className="social-btn" href="#"><Instagram size={16} /></a>
              <a className="social-btn" href="#"><Youtube size={16} /></a>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              {quickLinks.map((t, i) => (
                <li key={i}>
                  <a href="#"><ChevronRight size={14} /> {t}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* USEFUL LINKS */}
          <div className="footer-col">
            <h4>Useful Links</h4>
            <ul>
              {usefulLinks.map((t, i) => (
                <li key={i}>
                  <a href="#"><ChevronRight size={14} /> {t}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h4>Contact Us</h4>
            <div className="contact-card">
              <div className="contact-item">
                <MapPin size={18} />
                <span style={{ whiteSpace: "pre-line" }}>{fullAddress}</span>
              </div>

              <div className="contact-item">
                <Phone size={18} />
                <div>
                  <a href="tel:+919876543210">+91 98765 43210</a><br />
                  <a href="tel:+919876599765">+91 98765 99765</a>
                </div>
              </div>

              <div className="contact-item">
                <Mail size={18} />
                <div>
                  <a href="mailto:info@ssrcollege.edu">info@ssrcollege.edu</a><br />
                  <a href="mailto:admissions@ssrcollege.edu">
                    admissions@ssrcollege.edu
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER BOTTOM */}
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} SSR Degree College. All Rights Reserved.
          </span>

          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms</a>
            <a href="#">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
