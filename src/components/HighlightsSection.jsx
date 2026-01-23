import React from "react";
import { Award, Users, BookOpen, GraduationCap } from "lucide-react";

const HighlightCard = ({ icon, title, text }) => (
  <div className="p-4 shadow rounded bg-white text-center">
    <div className="mb-2">{icon}</div>
    <h5 className="fw-bold">{title}</h5>
    <p className="text-muted small">{text}</p>
  </div>
);

const HighlightsSection = () => {
  return (
    <>
      <div className="container py-5">
        <h3 className="mb-4 text-primary fw-bold">Key Highlights</h3>

        <div className="row g-3">
          <div className="col-md-3 col-sm-6">
            <HighlightCard
              icon={<Award size={28} />}
              title="Quality Education"
              text="Highly structured academic learning"
            />
          </div>

          <div className="col-md-3 col-sm-6">
            <HighlightCard
              icon={<Users size={28} />}
              title="Experienced Faculty"
              text="Industry experts as mentors"
            />
          </div>

          <div className="col-md-3 col-sm-6">
            <HighlightCard
              icon={<BookOpen size={28} />}
              title="Modern Labs"
              text="Hands-on training in advanced labs"
            />
          </div>

          <div className="col-md-3 col-sm-6">
            <HighlightCard
              icon={<GraduationCap size={28} />}
              title="Student Support"
              text="Counseling & placement guidance"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default HighlightsSection;
