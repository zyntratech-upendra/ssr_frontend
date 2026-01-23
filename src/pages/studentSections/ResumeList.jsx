import React, { useState, useEffect } from "react";
import ResumeCard from "./ResumeCard";

import {
  getResumesByFolder,
  uploadResume,
  replaceResume,
  deleteResume,
  downloadResume,
  previewResume,
} from "../../services/resumeUploadService";

function ResumeList({ folder, onBack }) {
  const [resumes, setResumes] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadResumes();
  }, [folder]);

  const loadResumes = async () => {
    try {
      const data = await getResumesByFolder(folder._id);
      setResumes(data);
    } catch (error) {
      console.error("Error fetching resumes:", error);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024)
      return alert("File size must be less than 5MB");

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type))
      return alert("Only PDF and DOCX files are allowed");

    setUploading(true);

    try {
      const newResume = await uploadResume(file, folder._id);
      setResumes([newResume, ...resumes]);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload resume");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleReplace = async (resumeId, file) => {
    if (file.size > 5 * 1024 * 1024)
      return alert("File size must be less than 5MB");

    try {
      const updated = await replaceResume(resumeId, file);
      setResumes(resumes.map((r) => (r._id === resumeId ? updated : r)));
    } catch (error) {
      console.error("Error replacing:", error);
      alert("Failed to replace resume");
    }
  };

  const handleDelete = async (resumeId) => {
    if (!window.confirm("Delete this resume?")) return;

    try {
      await deleteResume(resumeId);
      setResumes(resumes.filter((r) => r._id !== resumeId));
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete resume");
    }
  };

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        <div style={headerStyle}>
          <button onClick={onBack} style={backButtonStyle}>
            ← Back to Folders
          </button>

          <h2 style={titleStyle}>{folder.name}</h2>

          <label style={uploadButtonStyle}>
            {uploading ? "Uploading..." : "+ Upload Resume"}
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleUpload}
              style={{ display: "none" }}
              disabled={uploading}
            />
          </label>
        </div>

        <div style={gridStyle}>
          {resumes.map((resume) => (
            <ResumeCard
              key={resume._id}
              resume={resume}
              onPreview={() => previewResume(resume.fileName)}
              onDownload={() => downloadResume(resume._id)}
              onReplace={(file) => handleReplace(resume._id, file)}
              onDelete={() => handleDelete(resume._id)}
            />
          ))}
        </div>

        {resumes.length === 0 && (
          <div style={emptyStateStyle}>
            <p>No resumes in this folder yet. Upload one to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}

const containerStyle = { minHeight: "calc(100vh - 73px)", background: "#f5f5f5" };
const contentStyle = { maxWidth: "1200px", margin: "0 auto", padding: "2rem" };
const headerStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", gap: "1rem" };
const backButtonStyle = { background: "#ecf0f1", padding: "0.75rem 1.5rem", borderRadius: "6px" };
const titleStyle = { fontSize: "1.75rem", fontWeight: "600", flex: 1, textAlign: "center" };
const uploadButtonStyle = { background: "#27ae60", color: "#fff", padding: "0.75rem 1.5rem", borderRadius: "6px", cursor: "pointer" };
const gridStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" };
const emptyStateStyle = { textAlign: "center", padding: "4rem", color: "#7f8c8d" };

export default ResumeList;
