import React, { useEffect, useState } from "react";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const Placements = () => {
  const [placementData, setPlacementData] = useState([]);
  const [activeYear, setActiveYear] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch data from backend
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/placements`)
      .then((res) => {
        setPlacementData(res.data);
        if (res.data.length > 0) setActiveYear(res.data[0].year);
      })
      .catch((err) => console.error("Error fetching placements:", err))
      .finally(() => setLoading(false));
  }, []);

  // Filter data for selected year
  const selectedYearData = placementData.find((item) => item.year === activeYear);

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p>Loading placement data...</p>
      </div>
    );

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4 fw-bold text-primary">
        Placement Statistics
      </h2>

      {/* Tabs for year selection */}
      <ul className="nav nav-tabs justify-content-center mb-4">
        {placementData.map((item) => (
          <li className="nav-item" key={item.year}>
            <button
              className={`nav-link ${activeYear === item.year ? "active" : ""}`}
              onClick={() => setActiveYear(item.year)}
            >
              {item.year}
            </button>
          </li>
        ))}
      </ul>

      {/* Cards Section */}
      {selectedYearData ? (
        <div className="row">
          {selectedYearData.records.map((rec, idx) => (
            <div key={idx} className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body text-center">
                  <h5 className="card-title text-primary fw-bold">
                    {rec.company}
                  </h5>
                  <p className="mb-2">Students Placed: {rec.placed}</p>
                  <p className="text-muted">Package: {rec.package} LPA</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted">No data available for this year.</p>
      )}
    </div>
  );
};

export default Placements;
