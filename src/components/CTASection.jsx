import React from "react";

const CTASection = () => {
  return (
    <>
      <div className="container py-5 text-white rounded"
        style={{
          background: "linear-gradient(90deg,#6a1b9a,#1e88e5)",
        }}
      >
        <div className="d-flex flex-wrap justify-content-between align-items-center">
          <div>
            <h3>Ready to Start Your Journey?</h3>
            <p>Apply now or explore our programs.</p>
          </div>

          <div>
            <a href="#apply" className="btn btn-light me-2">Apply Now</a>
            <a href="/contact" className="btn btn-outline-light">Contact Us</a>
          </div>
        </div>
      </div>
    </>
  );
};

export default CTASection;
