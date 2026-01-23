// src/pages/ResumeUpload.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";

import FolderCard from "./studentSections/FolderCard";
import FolderModal from "./studentSections/FolderModal";
import ResumeList from "./studentSections/ResumeList";

// FOLDER service (axios-based)
import {
  getFolders,
  createFolder,
  renameFolder,
  deleteFolder,
} from "../services/resumeUploadService";

function ResumeUpload() {
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingFolder, setEditingFolder] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Load folders on mount
  useEffect(() => {
    loadFolders();
  }, []);

  const loadFolders = async () => {
    try {
      const data = await getFolders(); // axios returns data directly
      setFolders(data);
    } catch (error) {
      console.error("Error fetching folders:", error);
    }
  };

  // Create folder
  const handleCreateFolder = async (name) => {
    try {
      const newFolder = await createFolder(name);
      setFolders([newFolder, ...folders]);
      setShowModal(false);
    } catch (error) {
      console.error("Error creating folder:", error);
    }
  };

  // Rename folder
  const handleRenameFolder = async (id, name) => {
    try {
      const updatedFolder = await renameFolder(id, name);
      setFolders(folders.map((f) => (f._id === id ? updatedFolder : f)));
      setEditingFolder(null);
      setShowModal(false);
    } catch (error) {
      console.error("Error renaming folder:", error);
    }
  };

  // Delete folder
  const handleDeleteFolder = async (id) => {
    if (!window.confirm("Delete this folder and all its resumes?")) return;

    try {
      await deleteFolder(id);
      setFolders(folders.filter((f) => f._id !== id));

      if (selectedFolder?._id === id) {
        setSelectedFolder(null);
      }
    } catch (error) {
      console.error("Error deleting folder:", error);
    }
  };

  const openRenameModal = (folder) => {
    setEditingFolder(folder);
    setShowModal(true);
  };

  return (
    <>
      <style>{`
        :root {
          --primary: #2563eb;
          --primary-soft: #eff6ff;
          --muted: #6b7280;
          --card-bg: #ffffff;
        }

        .resume-page {
          display: flex;
          min-height: 100vh;
          background: radial-gradient(circle at top left,#eff6ff,#e0f2fe);
        }

        .resume-main {
          flex: 1;
          padding: 24px 32px;
          transition: margin-left .32s ease;
        }

        .resume-card {
          max-width: 1100px;
          margin: 10px auto 0;
          background: var(--card-bg);
          border-radius: 16px;
          padding: 22px 22px 24px;
          box-shadow: 0 14px 35px rgba(15,23,42,0.14);
        }

        .resume-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .resume-title {
          font-size: 26px;
          font-weight: 800;
          color: #111827;
          margin: 0;
        }

        .resume-subtitle {
          color: var(--muted);
          font-size: 14px;
          margin: 2px 0 0 0;
        }

        .resume-header-text {
          display: flex;
          flex-direction: column;
        }

        .btn-primary-soft {
          background: var(--primary);
          border: none;
          color: #ffffff;
          padding: 10px 18px;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 600;
          box-shadow: 0 10px 25px rgba(37,99,235,0.35);
          transition: transform .12s ease, box-shadow .12s ease, background .15s ease;
          white-space: nowrap;
        }

        .btn-primary-soft:hover {
          transform: translateY(-1px);
          background: #1d4ed8;
          box-shadow: 0 14px 30px rgba(30,64,175,0.45);
        }

        .folders-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
          gap: 18px;
        }

        .empty-state {
          text-align: center;
          padding: 40px 16px 10px;
          color: #6b7280;
          font-size: 15px;
        }

        @media (max-width: 992px) {
          .resume-main { padding: 20px 16px; }
        }

        @media (max-width: 768px) {
          .resume-main { padding: 16px 10px; }
          .resume-title { font-size: 22px; }
          .resume-header { align-items: flex-start; }
        }

        @media (max-width: 480px) {
          .resume-main { padding: 10px 6px; }
          .resume-card { padding: 16px 14px 18px; border-radius: 12px; }
          .resume-title { font-size: 20px; }
        }
      `}</style>

      <div className="resume-page">
        <Sidebar onToggle={setSidebarOpen} />

        <main
          className="resume-main"
          style={{ marginLeft: sidebarOpen ? "250px" : "80px" }}
        >
          {!selectedFolder ? (
            <section className="resume-card">
              <div className="resume-header">
                <div className="resume-header-text">
                  <h2 className="resume-title">Resume Folders</h2>
                  <p className="resume-subtitle mb-0">
                    Organise your multiple resume versions by company or role.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setEditingFolder(null);
                    setShowModal(true);
                  }}
                  className="btn-primary-soft"
                >
                  + New Folder
                </button>
              </div>

              <div className="folders-grid">
                {folders.map((folder) => (
                  <FolderCard
                    key={folder._id}
                    folder={folder}
                    onOpen={() => setSelectedFolder(folder)}
                    onRename={() => openRenameModal(folder)}
                    onDelete={() => handleDeleteFolder(folder._id)}
                  />
                ))}
              </div>

              {folders.length === 0 && (
                <div className="empty-state">
                  <p className="mb-0">
                    No folders yet. Create one to get started!
                  </p>
                </div>
              )}
            </section>
          ) : (
            <section className="resume-card">
              <ResumeList
                folder={selectedFolder}
                onBack={() => setSelectedFolder(null)}
              />
            </section>
          )}

          {showModal && (
            <FolderModal
              folder={editingFolder}
              onSave={
                editingFolder
                  ? (name) => handleRenameFolder(editingFolder._id, name)
                  : handleCreateFolder
              }
              onClose={() => {
                setShowModal(false);
                setEditingFolder(null);
              }}
            />
          )}
        </main>
      </div>
    </>
  );
}

export default ResumeUpload;
