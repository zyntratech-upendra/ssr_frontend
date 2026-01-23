// src/pages/FeeManagement.jsx
import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";
import FeeCreationForm from "./AdminCreateFee";
import StudentFeeList from "./StudentFeeList";
import { DollarSign, Users } from "lucide-react";

export default function FeeManagement() {
  const [activeTab, setActiveTab] = useState("create");
  const [refreshKey, setRefreshKey] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleFeeCreated = () => {
    setRefreshKey((prev) => prev + 1);
    setActiveTab("manage");
  };

  return (
    <>
      <style>{`
        :root {
          --primary: #2563eb;
          --muted: #6b7280;
          --card-bg: #ffffff;
        }

        .admin-page {
          display: flex;
          min-height: 100vh;
          background: linear-gradient(135deg,#eff6ff,#e0f2fe);
        }

        .main-content {
          flex: 1;
          padding: 24px 32px;
          transition: margin-left .32s ease;
        }

        .fee-header-title {
          font-size: 30px;
          font-weight: 800;
          color: #111827;
        }

        .fee-header-sub {
          color: var(--muted);
          font-size: 15px;
        }

        .tabs-card {
          background: var(--card-bg);
          border-radius: 14px;
          box-shadow: 0 8px 22px rgba(15,23,42,0.12);
          overflow: hidden;
        }

        .tabs-header {
          display: flex;
          border-bottom: 1px solid #e5e7eb;
          overflow-x: auto;
        }

        .tab-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 22px;
          font-weight: 600;
          font-size: 14px;
          border: none;
          background: transparent;
          white-space: nowrap;
          cursor: pointer;
          transition: color .2s ease, border-color .2s ease, background .2s ease;
        }

        .tab-btn-icon {
          width: 20px;
          height: 20px;
        }

        .tab-btn.active {
          color: var(--primary);
          border-bottom: 2px solid var(--primary);
          background: #eff6ff;
        }

        .tab-btn.inactive {
          color: #6b7280;
        }

        .tab-btn.inactive:hover {
          color: #111827;
          background: #f9fafb;
        }

        .tab-body {
          padding: 18px 18px 20px;
        }

        @media (max-width: 992px) {
          .main-content { padding: 20px 16px; }
        }
        @media (max-width: 768px) {
          .main-content { padding: 16px 10px; }
          .fee-header-title { font-size: 24px; text-align:center; }
          .fee-header-sub { text-align:center; }
        }
        @media (max-width: 480px) {
          .main-content { padding: 12px 6px; }
          .tabs-card { border-radius: 10px; }
          .tab-body { padding: 14px; }
        }
      `}</style>

      <div className="admin-page">
        <Sidebar onToggle={setSidebarOpen} />

        <main
          className="main-content"
          style={{ marginLeft: sidebarOpen ? "250px" : "80px" }}
        >
          <div className="mb-4">
            <h1 className="fee-header-title mb-1">Fee Management System</h1>
            <p className="fee-header-sub mb-0">
              Create fee structures and manage student fee payments.
            </p>
          </div>

          <section className="tabs-card mb-4">
            <div className="tabs-header">
              <button
                onClick={() => setActiveTab("create")}
                className={
                  "tab-btn " +
                  (activeTab === "create" ? "active" : "inactive")
                }
                type="button"
              >
                <DollarSign className="tab-btn-icon" />
                <span>Create Fee</span>
              </button>

              <button
                onClick={() => setActiveTab("manage")}
                className={
                  "tab-btn " +
                  (activeTab === "manage" ? "active" : "inactive")
                }
                type="button"
              >
                <Users className="tab-btn-icon" />
                <span>Manage Student Fees</span>
              </button>
            </div>

            <div className="tab-body">
              {activeTab === "create" ? (
                <FeeCreationForm onSuccess={handleFeeCreated} />
              ) : (
                <StudentFeeList key={refreshKey} />
              )}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
