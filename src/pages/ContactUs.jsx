import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const ContactUs = () => {
  return (
    <>
      <Navbar />

      {/* ================= CONTACT STYLES ================= */}
      <style>{`
        :root {
          --primary: #7a54b1;
          --primary-dark: #643e94;
          --primary-soft: #f3effc;
          --text-main: #0f172a;
          --text-muted: #64748b;
          --border-light: #e5e7eb;
          --shadow-soft: 0 14px 36px rgba(0,0,0,0.14);
        }

        body {
          font-family: 'Inter', system-ui, -apple-system,
            BlinkMacSystemFont, 'Segoe UI',
            Roboto, Arial, sans-serif;
        }

        /* ================= HERO ================= */
        .contact-hero {
          min-height: 260px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: white;
          background:
            linear-gradient(
              to right,
              rgba(122,84,177,0.88),
              rgba(122,84,177,0.6)
            ),
            url("https://images.pexels.com/photos/3184433/pexels-photo-3184433.jpeg");
          background-size: cover;
          background-position: center;
        }

        .contact-hero h1 {
          font-size: 42px;
          font-weight: 800;
          letter-spacing: 0.5px;
        }

        /* ================= WRAPPER ================= */
        .contact-wrapper {
          max-width: 1200px;
          margin: 70px auto;
          padding: 0 20px;
          display: grid;
          grid-template-columns: 1fr 1.4fr;
          gap: 44px;
        }

        /* ================= IMAGE ================= */
        .contact-image img {
          width: 100%;
          border-radius: 18px;
          box-shadow: var(--shadow-soft);
        }

        /* ================= CONTENT ================= */
        .contact-content h2 {
          font-size: 28px;
          font-weight: 700;
          color: var(--primary);
          margin-bottom: 14px;
        }

        .contact-content p {
          font-size: 16px;
          color: var(--text-muted);
          line-height: 1.8;
          margin-bottom: 26px;
        }

        /* ================= INFO CARD ================= */
        .contact-info {
          background: white;
          border: 1px solid var(--border-light);
          border-radius: 18px;
          padding: 24px;
          box-shadow: 0 12px 30px rgba(0,0,0,0.1);
          display: grid;
          gap: 16px;
        }

        .info-item {
          display: flex;
          gap: 14px;
          align-items: flex-start;
          font-size: 15px;
          color: var(--text-main);
        }

        .info-item svg {
          color: var(--primary);
          flex-shrink: 0;
          margin-top: 2px;
        }

        .info-item span {
          font-weight: 600;
          color: var(--primary);
        }

        /* ================= MAP ================= */
        .map-section {
          max-width: 1200px;
          margin: 0 auto 80px;
          padding: 0 20px;
        }

        .map-frame {
          width: 100%;
          height: 420px;
          border-radius: 18px;
          border: none;
          box-shadow: var(--shadow-soft);
        }

        /* ================= RESPONSIVE ================= */
        @media (max-width: 992px) {
          .contact-wrapper {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .contact-content {
            text-align: left;
          }

          .contact-hero h1 {
            font-size: 34px;
          }
        }

        @media (max-width: 480px) {
          .contact-hero h1 {
            font-size: 28px;
          }

          .contact-content h2 {
            font-size: 24px;
          }

          .map-frame {
            height: 320px;
          }
        }
      `}</style>

      {/* ================= HERO ================= */}
      <section className="contact-hero">
        <h1>Contact Us</h1>
      </section>

      {/* ================= CONTENT ================= */}
      <section className="contact-wrapper">
        {/* IMAGE */}
        <div className="contact-image">
          <img
            src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg"
            alt="Contact SSR Degree College"
          />
        </div>

        {/* CONTENT */}
        <div className="contact-content">
          <h2>Get in Touch</h2>
          <p>
            We’re here to help! Reach out to SSR Degree College for admissions,
            academic support, or general enquiries. Our dedicated team is always
            ready to assist you.
          </p>

          <div className="contact-info">
            <div className="info-item">
              <MapPin size={20} />
              <div>
                <span>Address:</span><br />
                SSR Degree College, Jagannadhapuram, Machilipatnam
              </div>
            </div>

            <div className="info-item">
              <Phone size={20} />
              <div>
                <span>Phone:</span><br />
                +91 98765 43210
              </div>
            </div>

            <div className="info-item">
              <Mail size={20} />
              <div>
                <span>Email:</span><br />
                info@ssrcollege.ac.in
              </div>
            </div>

            <div className="info-item">
              <Clock size={20} />
              <div>
                <span>Working Hours:</span><br />
                Mon – Sat, 9:00 AM – 5:00 PM
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MAP ================= */}
      <section className="map-section">
        <iframe
          className="map-frame"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3831.752232474001!2d81.1331668!3d16.181722599999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a49e7c6551437fb%3A0x4f8e0dc6bf911f0a!2sSSR%20Degree%20College!5e0!3m2!1sen!2sin!4v1763482176908!5m2!1sen!2sin"
          loading="lazy"
          allowFullScreen
          title="SSR Degree College Location"
        />
      </section>

      <Footer />
    </>
  );
};

export default ContactUs;
