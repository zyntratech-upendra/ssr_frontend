import React from "react";

const PrincipalMessage = () => {
  return (
    <>
      <div className="container py-5">
        <div className="row g-4 align-items-center">
          <div className="col-md-3">
            <div className="principal-img"></div>
          </div>

          <div className="col-md-9">
            <h3 className="text-primary fw-bold">Principal’s Message</h3>
            <p className="text-muted">
              At SSR, we aim to inspire students to become responsible, ethical
              and visionary leaders. Our mission is to provide a vibrant learning
              ecosystem for all.
            </p>

            <h6 className="fw-bold">— Dr. S. Reddy</h6>
          </div>
        </div>
      </div>

      <style>{`
        .principal-img {
          height: 200px;
          border-radius: 12px;
          background-image: url('https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800');
          background-size: cover;
          background-position: center;
        }
      `}</style>
    </>
  );
};

export default PrincipalMessage;
