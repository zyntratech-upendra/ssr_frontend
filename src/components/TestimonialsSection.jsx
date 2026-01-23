import React from "react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote:
        "SSR helped me discover my potential — excellent faculty & placement!",
      by: "Harsh Kumar, Alumni",
    },
    {
      quote:
        "The learning environment is amazing, and the labs are very advanced.",
      by: "Priya Sharma, Alumni",
    },
  ];

  return (
    <>
      <div className="container py-5">
        <h3 className="mb-4 text-primary fw-bold">Student Testimonials</h3>

        <div className="row g-3">
          {testimonials.map((t, i) => (
            <div className="col-md-6" key={i}>
              <div className="p-4 shadow bg-white rounded">
                <p className="fst-italic">“{t.quote}”</p>
                <strong className="text-muted">{t.by}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default TestimonialsSection;
