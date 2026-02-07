import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import CombinedApplicantDetails from '../components/CombinedApplicantDetails';
import SavedDraftsList from '../components/SavedDraftsList';
import { getDraftById, submitApplication, deleteDraft } from '../services/admissonService';
import { ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';

/**
 * AdmissionFormWithDrafts
 * Wrapper component that shows saved drafts and allows resuming or starting new applications
 * Improved with full-page form view and better navigation
 */
export default function AdmissionFormWithDrafts({ onSuccess }) {
  const [viewMode, setViewMode] = useState('drafts'); // 'drafts' | 'form'
  const [draftData, setDraftData] = useState(null);
  const [formMode, setFormMode] = useState('new'); // 'new' | 'edit'
  const [showDrafts, setShowDrafts] = useState(true);
  const [currentDraftId, setCurrentDraftId] = useState(null);

  const handleResumeDraft = async (draftData) => {
    setDraftData(draftData);
    setFormMode('edit');
    setViewMode('form');
  };

  const handleEditDraft = async (draftId) => {
    try {
      const response = await getDraftById(draftId);
      const draft = response.data || response;
      if (draft?.draftData) {
        setCurrentDraftId(draftId);
        setDraftData({ ...draft.draftData, draftId });
        setFormMode('edit');
        setViewMode('form');
      }
    } catch (error) {
      console.error('Error loading draft:', error);
    }
  };

  const handleFormNext = async (payload, meta) => {
    if (meta.submit) {
      try {
        // Submit the application
        const response = await submitApplication(payload);
        
        // Delete the draft after successful submission
        if (currentDraftId) {
          await deleteDraft(currentDraftId);
        }
        
        // Show success and navigate to summary/confirmation page
        alert('Application submitted successfully!');
        
        // Call parent callback if provided
        if (typeof onSuccess === 'function') {
          onSuccess(response);
        } else {
          // Reset and go back to drafts view
          setViewMode('drafts');
          setDraftData(null);
          setCurrentDraftId(null);
          setFormMode('new');
        }
      } catch (error) {
        console.error('Submission error:', error);
        alert('Failed to submit application: ' + (error.message || 'Please try again'));
      }
    }
  };

  const startNewApplication = () => {
    setDraftData(null);
    setCurrentDraftId(null);
    setFormMode('new');
    setViewMode('form');
  };

  const backToDrafts = () => {
    setViewMode('drafts');
    setDraftData(null);
    setCurrentDraftId(null);
    setFormMode('new');
  };

  return (
    <Layout>
      <div style={styles.container}>
        {/* DRAFTS VIEW */}
        {viewMode === 'drafts' && (
          <>
            {/* Header */}
            <div style={styles.pageHeader}>
              <h1 style={styles.pageTitle}>Admission Application</h1>
              <p style={styles.pageSubtitle}>Fill up your requisite details to apply for admission</p>
            </div>

            {/* Drafts Section */}
            <div style={styles.section}>
              <button
                onClick={() => setShowDrafts(!showDrafts)}
                style={styles.collapsibleHeader}
              >
                <div style={styles.headerContent}>
                  <h2 style={styles.sectionTitle}>📋 Your Saved Drafts</h2>
                  <p style={styles.sectionHint}>Resume your incomplete applications</p>
                </div>
                <div style={styles.chevron}>
                  {showDrafts ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </button>

              {showDrafts && (
                <div style={styles.draftsContent}>
                  <SavedDraftsList
                    onResumeDraft={handleResumeDraft}
                    onEditDraft={handleEditDraft}
                  />

                  <button onClick={startNewApplication} style={styles.startNewBtn}>
                    ✏️ Start New Application
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* FORM VIEW */}
        {viewMode === 'form' && (
          <div style={styles.formViewContainer}>
            {/* Form Header with Navigation */}
            <div style={styles.formViewHeader}>
              <button
                onClick={backToDrafts}
                style={styles.backButton}
                title="Back to drafts"
              >
                <ArrowLeft size={18} />
                Back to Drafts
              </button>
              <div>
                <h2 style={styles.formViewTitle}>
                  {formMode === 'new' ? '✨ New Application' : '📝 Edit Application'}
                </h2>
                <p style={styles.formViewSubtitle}>Complete all required fields to submit</p>
              </div>
              <div style={{ width: 120 }} />
            </div>

            {/* Form Content */}
            <div style={styles.formContent}>
              <CombinedApplicantDetails
                data={draftData || {}}
                onNext={handleFormNext}
                onPrevious={backToDrafts}
              />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

const styles = {
  container: {
    width: '100%',
    padding: '0',
  },
  
  /* ========== DRAFTS VIEW STYLES ========== */
  pageHeader: {
    textAlign: 'center',
    padding: '40px 20px 30px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    marginBottom: 0,
  },
  pageTitle: {
    margin: 0,
    fontSize: 32,
    fontWeight: 700,
    marginBottom: 8,
  },
  pageSubtitle: {
    margin: 0,
    fontSize: 16,
    opacity: 0.9,
  },
  
  section: {
    marginBottom: 0,
    background: 'white',
  },
  collapsibleHeader: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    background: 'linear-gradient(90deg, #f0f9ff, #f5f7ff)',
    border: 'none',
    borderBottom: '2px solid #e0e7ff',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  headerContent: {
    flex: 1,
    textAlign: 'left',
  },
  sectionTitle: {
    margin: 0,
    fontSize: 18,
    fontWeight: 700,
    color: '#0f172a',
    marginBottom: 4,
  },
  sectionHint: {
    margin: 0,
    fontSize: 13,
    color: '#6b7280',
  },
  chevron: {
    display: 'flex',
    alignItems: 'center',
    color: '#0f172a',
  },
  draftsContent: {
    padding: '30px 20px',
    background: 'white',
  },
  startNewBtn: {
    marginTop: 24,
    padding: '14px 24px',
    background: 'linear-gradient(90deg, #06b6d4, #2563eb)',
    color: 'white',
    border: 'none',
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    width: '100%',
    transition: 'all 0.2s ease',
  },

  /* ========== FORM VIEW STYLES ========== */
  formViewContainer: {
    width: '100%',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: '#f8fafc',
  },
  formViewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 20px',
    background: 'white',
    borderBottom: '1px solid #e2e8f0',
    boxShadow: '0 2px 8px rgba(15,23,42,0.06)',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 14px',
    background: 'transparent',
    color: '#2563eb',
    border: '1px solid #e0e7ff',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  formViewTitle: {
    margin: 0,
    fontSize: 22,
    fontWeight: 700,
    color: '#0f172a',
  },
  formViewSubtitle: {
    margin: '6px 0 0 0',
    fontSize: 13,
    color: '#6b7280',
  },
  formContent: {
    flex: 1,
    padding: '30px 20px',
    maxWidth: 1200,
    margin: '0 auto',
    width: '100%',
  },
};
