import React from "react";

const FacilitiesSection = () => {
  return (
    <>
      <div className="container py-5">
        <h3 className="mb-4 text-primary fw-bold">Campus Facilities</h3>

        <div className="row g-3">
          <div className="col-md-4">
            <div className="p-3 shadow rounded bg-white">
              <div className="facility-img mb-2"></div>
              <h5>Modern Labs</h5>
              <p className="text-muted small">Fully equipped practical labs</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="p-3 shadow rounded bg-white">
              <div className="facility-img mb-2"></div>
              <h5>Library Resources</h5>
              <p className="text-muted small">Digital & traditional books access</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="p-3 shadow rounded bg-white">
              <div className="facility-img mb-2"></div>
              <h5>Sports & Clubs</h5>
              <p className="text-muted small">Active student communities</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .facility-img {
          height: 120px;
          background: linear-gradient(145deg,#eee,#ddd);
          border-radius: 10px;
        }
      `}</style>
    </>
  );
};

export default FacilitiesSection;
