import React from "react";
import { GraduationCap, Users, BookOpen } from "lucide-react";

const AboutSection = () => {
  return (
    <>
      <style>
        {`
          .about-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-top: 40px;
          }
          .about-img {
            height: 300px;
            border-radius: 12px;
            background-size: cover;
            background-position: center;
            background-image: url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1000');
          }
          .about-list li {
            display: flex;
            gap: 8px;
            margin-bottom: 8px;
          }
        `}
      </style>

      <div className="container py-5" id="about">
        <h2 className="mb-4 text-primary fw-bold">About SSR Institute</h2>

        <div className="about-grid">
          <div className="about-img"></div>

          <div>
            <p className="text-muted">
              SSR is dedicated to delivering world-class education supported by
              modern infrastructure, highly experienced faculty and a student-focused
              learning ecosystem.
            </p>

            <ul className="about-list list-unstyled mt-3">
              <li><GraduationCap size={18}/> Accredited courses & excellence</li>
              <li><Users size={18}/> Student-friendly campus</li>
              <li><BookOpen size={18}/> Industry-oriented curriculum</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutSection;
