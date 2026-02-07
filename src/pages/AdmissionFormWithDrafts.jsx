import { useState } from "react";
import Layout from "../components/Layout";
import Sidebar from "../components/Sidebar";
import CombinedApplicantDetails from "../components/CombinedApplicantDetails";
import SavedDraftsList from "../components/SavedDraftsList";
import {
  getDraftById,
  submitApplication,
  deleteDraft,
} from "../services/admissonService";
import { ChevronDown, ChevronUp, ArrowLeft, Layers } from "lucide-react";

const AdmissionFormWithDrafts = ({ onSuccess }) => {
  const [viewMode, setViewMode] = useState("drafts");
  const [draftData, setDraftData] = useState(null);
  const [formMode, setFormMode] = useState("new");
  const [showDrafts, setShowDrafts] = useState(true);
  const [currentDraftId, setCurrentDraftId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleResumeDraft = (data) => {
    setDraftData(data);
    setFormMode("edit");
    setViewMode("form");
  };

  const handleEditDraft = async (id) => {
    const res = await getDraftById(id);
    const draft = res.data || res;
    if (draft?.draftData) {
      setCurrentDraftId(id);
      setDraftData({ ...draft.draftData, draftId: id });
      setFormMode("edit");
      setViewMode("form");
    }
  };

  const handleFormNext = async (payload, meta) => {
    if (!meta.submit) return;

    const res = await submitApplication(payload);
    if (currentDraftId) await deleteDraft(currentDraftId);

    alert("Application submitted successfully!");
    onSuccess?.(res);

    setViewMode("drafts");
    setDraftData(null);
    setCurrentDraftId(null);
    setFormMode("new");
  };

  return (
    <>
      {/* ===================== STYLES ===================== */}
      <style>{`
        :root {
          --sidebar-width: 250px;
          --sidebar-collapsed: 80px;
          --primary: #ad8ff8;
          --primary-dark: #8b6fe6;
          --primary-soft: #f5f1ff;
          --text-dark: #1e293b;
          --text-muted: #64748b;
          --border: #e5e7eb;
        }

        body {
          margin: 0;
          font-family: 'Inter','Poppins',system-ui,sans-serif;
          background: linear-gradient(135deg,#f7f4ff,#eef2ff);
          color: var(--text-dark);
        }

        .dashboard-container {
          display: flex;
          min-height: 100vh;
        }

        .main-content {
          flex: 1;
          padding: clamp(16px,3vw,36px);
          transition: margin-left .35s ease;
        }

        /* HEADER */
        .page-header {
          margin-bottom: 28px;
        }

        .page-title {
          font-size: clamp(22px,2.5vw,28px);
          font-weight: 700;
          color: var(--primary-dark);
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .page-subtitle {
          color: var(--text-muted);
          margin-top: 6px;
        }

        /* CARD */
        .card-box {
          background: linear-gradient(135deg,#fff,var(--primary-soft));
          border-radius: 16px;
          padding: 26px;
          box-shadow: 0 10px 30px rgba(173,143,248,0.18);
          margin-bottom: 32px;
        }

        .section-title {
          font-size: 20px;
          font-weight: 700;
          color: var(--primary-dark);
          margin-bottom: 16px;
        }

        /* COLLAPSIBLE */
        .collapsible-header {
          width: 100%;
          background: transparent;
          border: none;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          padding: 0;
        }

        .drafts-content {
          margin-top: 20px;
        }

        /* BUTTONS */
        .btn-primary-custom {
          background: linear-gradient(135deg,var(--primary-dark),var(--primary));
          border-radius: 12px;
          padding: 12px 22px;
          font-weight: 600;
          border: none;
          color: white;
          width: 100%;
          margin-top: 22px;
          cursor: pointer;
        }

        /* FORM VIEW */
        .form-wrapper {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0,0,0,.08);
        }

        .form-header {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 18px 22px;
          border-bottom: 1px solid var(--border);
          background: linear-gradient(135deg,#fff,var(--primary-soft));
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 10px;
          border: 1px solid var(--border);
          background: #fff;
          cursor: pointer;
          font-weight: 600;
          color: var(--primary-dark);
        }

        .form-body {
          padding: 22px;
        }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .card-box {
            padding: 18px;
          }
          .form-body {
            padding: 16px;
          }
        }
      `}</style>

     
        <div className="dashboard-container">
          <Sidebar onToggle={setSidebarOpen} />

          <div
            className="main-content"
            style={{
              marginLeft: sidebarOpen
                ? "var(--sidebar-width)"
                : "var(--sidebar-collapsed)",
            }}
          >
            {/* ================= DRAFTS VIEW ================= */}
            {viewMode === "drafts" && (
              <>
                <div className="page-header">
                  <h1 className="page-title">
                    <Layers size={26} /> Admission Application
                  </h1>
                  <p className="page-subtitle">
                    Fill up your details to apply for admission
                  </p>
                </div>

                <div className="card-box">
                  <button
                    className="collapsible-header"
                    onClick={() => setShowDrafts(!showDrafts)}
                  >
                    <div>
                      <h2 className="section-title">Saved Drafts</h2>
                      <p className="page-subtitle">
                        Resume incomplete applications
                      </p>
                    </div>
                    {showDrafts ? <ChevronUp /> : <ChevronDown />}
                  </button>

                  {showDrafts && (
                    <div className="drafts-content">
                      <SavedDraftsList
                        onResumeDraft={handleResumeDraft}
                        onEditDraft={handleEditDraft}
                      />

                      <button
                        className="btn-primary-custom"
                        onClick={() => {
                          setDraftData(null);
                          setFormMode("new");
                          setViewMode("form");
                        }}
                      >
                        Start New Application
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* ================= FORM VIEW ================= */}
            {viewMode === "form" && (
              <div className="card-box form-wrapper">
                <div className="form-header">
                  <button
                    className="back-btn"
                    onClick={() => setViewMode("drafts")}
                  >
                    <ArrowLeft size={16} /> Back
                  </button>
                  <div>
                    <h2 className="section-title">
                      {formMode === "new"
                        ? "New Application"
                        : "Edit Application"}
                    </h2>
                    <p className="page-subtitle">
                      Complete all required fields
                    </p>
                  </div>
                </div>

                <div className="form-body">
                  <CombinedApplicantDetails
                    data={draftData || {}}
                    onNext={handleFormNext}
                    onPrevious={() => setViewMode("drafts")}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
    
    </>
  );
};

export default AdmissionFormWithDrafts;
