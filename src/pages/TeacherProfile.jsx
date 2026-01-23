import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../components/Sidebar";
import { Edit2, Save, X } from "lucide-react";
import ProfileHeader from "./teacherSections/ProfileHeader";
import AboutSection from "./teacherSections/AboutSection";
import QualificationsSection from "./teacherSections/QualificationsSection";
import ExperienceSection from "./teacherSections/ExperienceSection";
import SocialLinks from "./teacherSections/SocialLinks";
import {
  getTeacherProfile,
  updateTeacherProfile,
  uploadTeacherImage,
} from "../services/teacherService";
import { getCurrentUserId } from "../services/authService";

const UPLOADED_FILE_PATH = "/mnt/data/user-uploaded-file";

export default function TeacherProfile() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profile, setProfile] = useState({
    fullName: "",
    designation: "",
    email: "",
    phone: "",
    employeeId: "",
    about: "",
    qualifications: [],
    subjects: [],
    researchInterests: [],
    publications: [],
    achievements: [],
    experienceYears: 0,
    profileImage: "",
    linkedin: "",
    github: "",
    twitter: "",
    website: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [teacherId, setTeacherId] = useState("");

  useEffect(() => {
    try {
      const id = getCurrentUserId();
      setTeacherId(id || "");
    } catch (err) {
      console.error("Unable to read current user id:", err);
    }
  }, []);

  useEffect(() => {
    if (!teacherId) {
      setLoading(false);
      return;
    }
    fetchProfile();
  }, [teacherId]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getTeacherProfile(teacherId);
      const resolved = data?.data ?? data;
      setProfile(resolved || {});
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setProfile((p) => ({ ...p, [field]: value }));
  };
  const handleArrayChange = (field, value) => {
    setProfile((p) => ({ ...p, [field]: value }));
  };
  const handleSocialLinkChange = (platform, value) => {
    setProfile((p) => ({ ...p, [platform]: value }));
  };
  const handleImageChange = (file) => {
    setImageFile(file);
  };
  const handleSave = async () => {
    try {
      setLoading(true);
      let updatedProfile = { ...profile };
      if (imageFile) {
        const res = await uploadTeacherImage(imageFile);
        const url = res?.data?.url ?? res?.url ?? res;
        if (url) updatedProfile.profileImage = url;
        setImageFile(null);
      }
      await updateTeacherProfile(teacherId, updatedProfile);
      setProfile(updatedProfile);
      setIsEditing(false);
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setError("Failed to save profile. Please try again.");
      setTimeout(() => setError(""), 5000);
    } finally {
      setLoading(false);
    }
  };
  const handleCancel = () => {
    setIsEditing(false);
    fetchProfile();
  };
  const avatarFallback = profile.profileImage || UPLOADED_FILE_PATH || "";

  return (
    <>
      <style>{`
        :root {
          --main-bg: linear-gradient(115deg, #f0f4ff 0 72%, #d1e2ff 100%);
          --card-glass: rgba(255,255,255,0.97);
          --accent: #673ab7;
          --primary: #286ef6;
          --danger: #e11d48;
          --success: #14b8a6;
          --muted: #6c757d;
          --border: #f0f2f7;
          --shadow-main: 0 9px 28px rgba(65,62,93,0.09);
          --font: 'Inter', 'Segoe UI', 'Roboto', Arial, sans-serif;
        }
        body { background: var(--main-bg); font-family: var(--font); }
        .profile-main {
          min-height:100vh;
          background:var(--main-bg);
          display:flex;
          flex-direction:row;
        }
        .sidebar-area {
          transition: width .40s cubic-bezier(.77,.14,.48,1);
        }
        .main-content {
          flex:1;
          padding: 36px 18px;
          transition:margin-left .21s cubic-bezier(.77,.14,.48,1);
        }
        .profile-topbar {
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-bottom:30px;
          flex-wrap: wrap;
        }
        .profile-title {
          font-size:2.18rem;
          font-weight:800;
          color:#212022;
        }
        .profile-subtitle {
          font-size:1.08rem;
          color:var(--muted);
          margin-top:4px;
        }
        .btn-group { display:flex; gap:12px; flex-wrap: wrap;}
        .btn-smart {
          border-radius:12px;padding:10px 19px;font-weight:600;font-size:1rem;
          background: linear-gradient(92deg, var(--primary), var(--accent));
          color:#fff; border:none; box-shadow:0 5px 18px rgba(99,102,241,0.10);
          display:inline-flex; align-items:center; gap:10px; cursor:pointer; transition:transform .13s;
        }
        .btn-smart:hover { transform:scale(1.04) translateY(-2px); }
        .btn-ghost {
          background:transparent;color:var(--primary);border:1px solid var(--border);
          padding:10px 19px;border-radius:12px;font-weight:600;cursor:pointer;display:inline-flex;
          align-items:center;gap:10px;
        }
        .btn-ghost:hover { background:rgba(40,110,246,0.07); }
        .alert-card {
          width:100%;margin:0 0 14px 0;background:var(--card-glass);color:var(--danger);
          padding:13px 17px;border-radius:12px;font-weight:700;box-shadow:var(--shadow-main);
        }
        .alert-card.success { color: var(--success); border-left: 6px solid var(--success); }
        .alert-card.danger { color: var(--danger); border-left: 6px solid var(--danger); }
        .profile-grid {
          display: grid;
          grid-template-columns:390px 1fr;
          gap:32px;
          align-items: flex-start;
        }
        @media (max-width:1200px) {
          .profile-grid { grid-template-columns:270px 1fr; gap:18px; }
        }
        @media (max-width:900px) {
          .profile-main { flex-direction:column; }
          .sidebar-area { width:100%; }
          .main-content { padding:16px 5vw; margin-left: 0; }
          .profile-grid { display: block; }
          .profile-card {
            margin-bottom:25px;
            max-width: 100%;
            min-width: 0;
          }
        }
        @media (max-width:700px) {
          .profile-topbar { flex-direction:column; align-items:flex-start; }
          .card-panel { padding:13px 4vw; }
          .profile-card { padding:16px 7vw; }
          .avatar-img { width:70px;height:70px; }
          .profile-title { font-size:1.35rem; }
          .section-title { font-size:1rem; }
          .avatar-area { flex-direction:column; gap:12px; align-items: flex-start;}
        }
        @media (max-width:500px) {
          .main-content { padding:12px 2vw; }
          .profile-title { font-size:1.15rem; }
          .profile-card { padding:8px 4vw; }
          .avatar-img { width:56px; height:56px; }
          .card-panel { padding:7px 2vw; }
          .section-title { font-size:.92rem; }
        }
        .profile-card {
          background: linear-gradient(120deg,rgba(255,255,255,0.99),rgba(210,217,255,.97));
          border-radius:22px;
          box-shadow:var(--shadow-main);
          padding:26px 24px 17px 24px;
          display:flex;
          flex-direction:column;
          align-items:stretch;
          gap:5px;
          min-width:210px;
          max-width:500px;
          width:100%;
          word-break:break-word;
        }
        .avatar-area {
          display:flex; flex-direction:row; gap:22px; align-items:center; margin-bottom:7px;
        }
        .avatar-img {
          width:120px; height:120px; border-radius:22px; object-fit:cover;
          border:4px solid #fff;
          background: linear-gradient(130deg,#d9dbef 80%,#c6d0f7 100%);
          box-shadow:0 8px 28px rgba(99,102,241,0.16); transition:box-shadow .14s;
        }
        .avatar-img:hover { box-shadow:0 15px 54px rgba(99,102,241,0.23);}
        .meta-titles { flex:1; }
        .meta-name { font-size:1.34rem;font-weight:700;color:var(--primary);}
        .meta-role { font-size:1rem;color:var(--accent);font-weight:500;letter-spacing:.2px;margin-bottom:3px;}
        .contact-row {
          display:flex;
          gap:17px;
          margin:12px 0 6px 0;
          flex-wrap:wrap;
        }
        .contact-info {
          font-size:.98rem;
          color:var(--muted);
          max-width: 180px;
          word-break: break-word;
          overflow-wrap: anywhere;
        }
        @media (max-width:700px) {
          .contact-row {
            flex-direction:column;
            gap:8px;
          }
          .contact-info {
            max-width:100%;
          }
        }
        .profile-stats {
          display:flex;
          gap:13px;
          margin-top:4px;
          flex-wrap: wrap;
        }
        .stat {
          background: linear-gradient(89deg,#f0edff 60%,rgba(99,102,241,0.05));
          border-radius:9px;
          padding:9px 0px;
          min-width:70px;
          text-align:center;
          font-weight:600;
          font-size:1.04rem;
        }
        .stat small { display:block; font-weight:500; color: var(--muted); font-size:.82rem; }
        .actions-row { margin-top: 12px; display: flex; gap: 7px; flex-wrap:wrap; }
        .btn-avatar {
          padding:7px 15px; border-radius:8px;
          background:linear-gradient(92deg, var(--primary), var(--accent));
          color:#fff; border:none;font-size:13px;font-weight:600;cursor:pointer;box-shadow:0 3px 10px rgba(99,102,241,0.09);
        }
        .btn-avatar:hover { background:linear-gradient(92deg, var(--accent) 60%, var(--primary)); }
        .btn-view {
          background:transparent;color:var(--primary);border:1px solid var(--border);
          padding:7px 15px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;
        }
        .btn-view:hover { background:rgba(40,110,246,0.11); }
        .sections-flex { display:flex;flex-direction:column;gap:20px;}
        .card-panel {
          background:var(--card-glass);border-radius:14px;
          box-shadow:var(--shadow-main);padding:23px 22px;margin-bottom:0;
        }
        .section-header { display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:9px;}
        .section-title { font-size:1.17rem;font-weight:700;color:#211e32;}
        .section-sub { color:var(--muted); font-size:.97rem;margin-top:3px;}
      `}</style>

      <div className="profile-main">
        <div className="sidebar-area">
          <Sidebar onToggle={setSidebarOpen} />
        </div>
        <main
          className="main-content"
          style={{ marginLeft: sidebarOpen ? 255 : 80 }}
        >
          <div className="profile-topbar">
            <div>
              <div className="profile-title">Teacher Profile</div>
              <div className="profile-subtitle">
                Manage your official profile—personal, academic & social details.
              </div>
            </div>
            <div className="btn-group">
              {isEditing ? (
                <>
                  <button
                    className="btn-smart"
                    onClick={handleSave}
                    disabled={loading}
                    title="Save changes"
                  >
                    <Save size={18} /> Save
                  </button>
                  <button
                    className="btn-ghost"
                    onClick={handleCancel}
                    title="Cancel editing"
                  >
                    <X size={18} /> Cancel
                  </button>
                </>
              ) : (
                <button
                  className="btn-smart"
                  onClick={() => setIsEditing(true)}
                  title="Edit profile"
                >
                  <Edit2 size={18} /> Edit Profile
                </button>
              )}
            </div>
          </div>
          {error && (
            <div className="alert-card danger">{error}</div>
          )}
          {success && (
            <div className="alert-card success">{success}</div>
          )}
          <div className="profile-grid">
            <div className="profile-card">
              <div className="avatar-area">
                <img
                  src={avatarFallback}
                  alt="Profile"
                  className="avatar-img"
                  onError={(e) => {
                    e.currentTarget.src =
                      "data:image/svg+xml;charset=UTF-8," +
                      encodeURIComponent(
                        `<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><rect width='100%' height='100%' fill='#e9e9ef'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#6b6b77' font-family='Arial' font-size='20'>No Image</text></svg>`
                      );
                  }}
                />
                <div className="meta-titles">
                  <p className="meta-name">{profile.fullName || "—"}</p>
                  <p className="meta-role">{profile.designation || "—"}</p>
                  <div className="contact-row">
                    <div className="contact-info">
                      <strong>Email:</strong><br /><span>{profile.email || "—"}</span>
                    </div>
                    <div className="contact-info">
                      <strong>Phone:</strong><br /><span>{profile.phone || "—"}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="profile-stats">
                <div className="stat">
                  {profile.experienceYears ?? 0}
                  <small>Years</small>
                </div>
                <div className="stat">
                  {(profile.publications?.length ?? 0)}
                  <small>Publications</small>
                </div>
                <div className="stat">
                  {(profile.achievements?.length ?? 0)}
                  <small>Achievements</small>
                </div>
              </div>
              <div className="actions-row">
                {isEditing ? (
                  <>
                    <label className="btn-avatar" style={{ marginRight: 6, cursor: "pointer" }}>
                      Upload Photo
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleImageChange(f);
                        }}
                      />
                    </label>
                    <button
                      className="btn-avatar"
                      style={{ background: "var(--danger)" }}
                      onClick={() => {
                        setProfile((p) => ({ ...p, profileImage: "" }));
                      }}
                      title="Remove photo"
                    >
                      Remove Photo
                    </button>
                  </>
                ) : (
                  <a
                    className="btn-view"
                    href={profile.profileImage || avatarFallback}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View Photo
                  </a>
                )}
              </div>
            </div>
            <div className="sections-flex">
              <div className="card-panel">
                <div className="section-header">
                  <div>
                    <div className="section-title">About</div>
                    <div className="section-sub">
                      Quick summary, research interests & bio
                    </div>
                  </div>
                </div>
                <AboutSection
                  profile={profile}
                  isEditing={isEditing}
                  onInputChange={handleInputChange}
                />
              </div>
              <div className="card-panel">
                <div className="section-header">
                  <div className="section-title">Experience</div>
                </div>
                <ExperienceSection
                  profile={profile}
                  isEditing={isEditing}
                  onInputChange={handleInputChange}
                />
              </div>
              <div className="card-panel">
                <div className="section-header">
                  <div className="section-title">Qualifications & Subjects</div>
                </div>
                <QualificationsSection
                  profile={profile}
                  isEditing={isEditing}
                  onInputChange={handleInputChange}
                  onArrayChange={handleArrayChange}
                />
              </div>
              <div className="card-panel">
                <div className="section-header">
                  <div className="section-title">Social & Links</div>
                </div>
                <SocialLinks
                  links={{
                    linkedin: profile.linkedin,
                    github: profile.github,
                    twitter: profile.twitter,
                    website: profile.website,
                  }}
                  isEditing={isEditing}
                  onChange={handleSocialLinkChange}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
