// src/pages/StudentProfile.jsx
import { useState, useEffect } from "react";
import { Edit2, Save, X } from "lucide-react";

import Sidebar from "../components/Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";

import StudentProfileHeader from "./studentProfile/StudentProfileHeader.jsx";
import StudentAboutSection from "./studentProfile/StudentAboutSection";
import StudentSkillsSection from "./studentProfile/StudentSkillsSection";
import StudentProjectsSection from "./studentProfile/StudentProjectsSection";
import StudentInternshipsSection from "./studentProfile/StudentInternshipsSection";
import StudentSocialLinks from "./studentProfile/StudentSocialLinks";
import { getCurrentUserId } from "../services/authService.jsx";
import {
  getStudentProfile,
  updateStudentProfile,
  uploadStudentImage,
} from "../services/studentService.jsx";

export default function StudentProfile() {
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    studentId: "",
    semester: 0,
    cgpa: 0,
    about: "",
    profileImage: "",
    skills: [],
    languages: [],
    certifications: [],
    projects: [],
    internships: [],
    achievements: [],
    interests: [],
    linkedin: "",
    github: "",
    twitter: "",
    portfolio: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [studentId] = useState(getCurrentUserId());
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getStudentProfile(studentId);
      setProfile(data[0]);
      setError("");
    } catch (err) {
      setError("Failed to load profile. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleObjectArrayChange = (field, index, key, value) => {
    setProfile((prev) => {
      const updated = [...(prev[field] || [])];
      updated[index] = { ...updated[index], [key]: value };
      return { ...prev, [field]: updated };
    });
  };

  const handleAddObjectItem = (field) => {
    const defaults = {
      projects: { title: "", description: "", technologies: [], link: "" },
      internships: {
        company: "",
        position: "",
        duration: "",
        description: "",
      },
    };

    const newItem = defaults[field] || {};

    setProfile((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), newItem],
    }));
  };

  const handleRemoveObjectItem = (field, index) => {
    setProfile((prev) => ({
      ...prev,
      [field]: (prev[field] || []).filter((_, i) => i !== index),
    }));
  };

  const handleSocialLinkChange = (platform, value) => {
    setProfile((prev) => ({ ...prev, [platform]: value }));
  };

  const handleImageChange = (file) => {
    setImageFile(file);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      let updatedProfile = { ...profile };

      if (imageFile) {
        const imageData = await uploadStudentImage(imageFile);
        updatedProfile.profileImage = imageData.url;
        updatedProfile.cloudinaryId = imageData.cloudinaryId;
        setImageFile(null);
      }

      await updateStudentProfile(studentId, updatedProfile);
      setProfile(updatedProfile);
      setIsEditing(false);
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to save profile. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    fetchProfile();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        :root {
          --profile-bg: radial-gradient(circle at top left,#eff6ff,#e0f2fe);
        }

        .student-profile-layout {
          display: flex;
          min-height: 100vh;
          background: var(--profile-bg);
        }

        .student-profile-main {
          flex: 1;
          padding: 24px 32px;
          transition: margin-left .32s ease;
        }

        .student-profile-card {
          max-width: 960px;
          margin: 0 auto;
          background: #f9fafb;
          border-radius: 18px;
          padding: 22px 22px 26px;
          box-shadow: 0 14px 38px rgba(15,23,42,0.18);
        }

        @media (max-width: 992px) {
          .student-profile-main {
            padding: 20px 16px;
          }
          .student-profile-card {
            padding: 18px 16px 22px;
            border-radius: 16px;
          }
        }

        @media (max-width: 768px) {
          .student-profile-main {
            padding: 16px 10px;
          }
          .student-profile-card {
            padding: 16px 12px 20px;
          }
        }

        @media (max-width: 480px) {
          .student-profile-main {
            padding: 10px 6px;
          }
          .student-profile-card {
            border-radius: 12px;
          }
        }
      `}</style>

      <div className="student-profile-layout">
        <Sidebar onToggle={setSidebarOpen} />

        <main
          className="student-profile-main"
          style={{ marginLeft: sidebarOpen ? "250px" : "80px" }}
        >
          <div className="student-profile-card">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">
                Student Profile
              </h1>
              <div className="flex gap-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </button>

                    <button
                      onClick={handleCancel}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
                {success}
              </div>
            )}

            <div className="mb-6">
              <StudentProfileHeader
                profile={profile}
                isEditing={isEditing}
                onImageChange={handleImageChange}
                onInputChange={handleInputChange}
              />
            </div>

            <div className="mb-6">
              <StudentAboutSection
                profile={profile}
                isEditing={isEditing}
                onInputChange={handleInputChange}
              />
            </div>

            <div className="mb-6">
              <StudentSkillsSection
                profile={profile}
                isEditing={isEditing}
                onArrayChange={handleArrayChange}
              />
            </div>

            <div className="mb-6">
              <StudentProjectsSection
                profile={profile}
                isEditing={isEditing}
                onObjectArrayChange={handleObjectArrayChange}
                onAddItem={() => handleAddObjectItem("projects")}
                onRemoveItem={(index) =>
                  handleRemoveObjectItem("projects", index)
                }
              />
            </div>

            <div className="mb-6">
              <StudentInternshipsSection
                profile={profile}
                isEditing={isEditing}
                onObjectArrayChange={handleObjectArrayChange}
                onAddItem={() => handleAddObjectItem("internships")}
                onRemoveItem={(index) =>
                  handleRemoveObjectItem("internships", index)
                }
              />
            </div>

            <div className="mb-2">
              <StudentSocialLinks
                links={{
                  linkedin: profile.linkedin,
                  github: profile.github,
                  twitter: profile.twitter,
                  portfolio: profile.portfolio,
                }}
                isEditing={isEditing}
                onChange={handleSocialLinkChange}
              />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
