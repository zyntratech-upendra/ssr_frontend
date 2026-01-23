import React from "react";

const API = import.meta.env.VITE_API_URL;

const DepartmentsShowcase = ({ departments, loading }) => {
  return (
    <>
      <style>
        {`
          .dept-card {
            border-radius: 12px;
            overflow: hidden;
            background: #fff;
            box-shadow: 0 6px 20px rgba(0,0,0,0.05);
            transition: transform .2s;
          }
          .dept-card:hover {
            transform: translateY(-4px);
          }
          .dept-img {
            height: 150px;
            width: 100%;
            object-fit: cover;
          }
        `}
      </style>

      <div className="container py-5" id="departments">
        <h3 className="mb-4 text-primary fw-bold">Departments</h3>

        <div className="row g-3">
          {loading
            ? [...Array(4)].map((_, i) => (
                <div key={i} className="col-md-3 col-sm-6">
                  <div
                    className="skeleton"
                    style={{ height: 200, borderRadius: 12 }}
                  />
                </div>
              ))
            : departments.map((d) => (
                <div key={d._id} className="col-md-3 col-sm-6">
                  <div className="dept-card">
                    <img
                      src={`${API}${d.departmentImage}`}
                      className="dept-img"
                      alt={d.departmentName}
                    />
                    <div className="p-3">
                      <h6 className="fw-bold text-primary">
                        {d.departmentName}
                      </h6>
                      <p className="small text-muted">{d.description}</p>
                      <a
                        href={`/departments/${d._id}`}
                        className="btn btn-sm btn-outline-primary"
                      >
                        View
                      </a>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </>
  );
};

export default DepartmentsShowcase;
