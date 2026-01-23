import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    const emailRegex =
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const response = await login(formData.email, formData.password);
      if (response.success && response.user) {
        navigate(`/${response.user.role}/dashboard`);
      }
    } catch (err) {
      setError(
        err.message || "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      {/* ================= CURVED LOGIN STYLES ================= */}
      <style>{`
        :root {
          --primary: #7a54b1;
          --primary-dark: #643e94;
          --gold: #facc15;
          --bg: #f8fafc;
          --text-dark: #0f172a;
          --text-muted: #64748b;
        }

        body {
          font-family: 'Inter', system-ui, -apple-system,
            BlinkMacSystemFont, 'Segoe UI',
            Roboto, Arial, sans-serif;
        }

        .login-wrapper {
          min-height: calc(100vh - 120px);
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          position: relative;
          background: var(--bg);
          overflow: hidden;
        }

        /* ============ LEFT PANEL ============ */
        .login-left {
          background: linear-gradient(
            135deg,
            var(--primary),
            var(--primary-dark)
          );
          color: #fff;
          padding: 80px 70px;
          display: flex;
          align-items: center;
          position: relative;
          z-index: 1;
        }

        .brand-content {
          max-width: 520px;
        }

        .brand-content h1 {
          font-size: 48px;
          font-weight: 800;
          line-height: 1.2;
        }

        .brand-content h1 span {
          color: var(--gold);
        }

        .brand-content p {
          margin: 18px 0 30px;
          font-size: 17px;
          color: #eee6ff;
          line-height: 1.6;
        }

        .features div {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 14px;
          font-size: 15px;
        }

        .features svg {
          color: var(--gold);
        }

        /* ============ CURVE DIVIDER ============ */
        .curve-divider {
          position: absolute;
          left: 68%;
          top: -10%;
          width: 40%;
          height: 120%;
          background: var(--bg);
          border-radius: 50%;
          transform: translateX(-50%);
          z-index: 2;
          box-shadow: -20px 0 50px rgba(0,0,0,0.12);
        }

        /* ============ RIGHT PANEL ============ */
        .login-right {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
          z-index: 3;
          background: var(--bg);
        }

        .login-card {
          width: 100%;
          max-width: 420px;
          background: #fff;
          padding: 34px 32px 38px;
          border-radius: 22px;
          border: 1px solid #ede9fe;
          box-shadow: 0 26px 60px rgba(122,84,177,0.25);
          margin-left: -40px;
        }

        .login-header {
          text-align: center;
          margin-bottom: 22px;
        }

        .login-header h2 {
          font-size: 26px;
          color: var(--text-dark);
          margin-top: 8px;
        }

        .login-header p {
          font-size: 14px;
          color: var(--text-muted);
        }

        .form-label {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 6px;
        }

        .form-input {
          width: 100%;
          padding: 12px 14px;
          border-radius: 10px;
          border: 1px solid #d1d5db;
          background: #f9fafb;
          font-size: 14px;
        }

        .form-input:focus {
          outline: none;
          border-color: var(--primary);
          background: #fff;
          box-shadow: 0 0 0 3px rgba(122,84,177,0.2);
        }

        .error-message {
          color: #ef4444;
          font-size: 14px;
          margin-bottom: 10px;
        }

        .password-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: var(--primary);
        }

        .form-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 10px 0 16px;
          font-size: 14px;
        }

        .login-button {
          width: 100%;
          padding: 13px;
          border-radius: 14px;
          background: linear-gradient(
            135deg,
            var(--primary),
            var(--primary-dark)
          );
          color: white;
          border: none;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
        }

        .login-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 14px 30px rgba(122,84,177,0.35);
        }

        .login-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        /* ============ RESPONSIVE ============ */
        @media (max-width: 900px) {
          .login-wrapper {
            grid-template-columns: 1fr;
          }

          .login-left,
          .curve-divider {
            display: none;
          }

          .login-right {
            background: #fff;
          }

          .login-card {
            margin-left: 0;
            box-shadow: none;
            border-radius: 0;
            max-width: 100%;
          }
        }

        @media (max-width: 520px) {
          .login-right {
            padding: 24px 16px;
          }

          .login-card {
            padding: 26px 20px 28px;
          }
        }
      `}</style>

      {/* ================= CURVED LOGIN LAYOUT ================= */}
      <div className="login-wrapper">
        {/* LEFT */}
        <div className="login-left">
          <div className="brand-content">
            <h1>
              SSR <span>College</span>
            </h1>
            <p>
              Securely manage students, faculty, attendance, and academic
              operations with our modern college management system.
            </p>

            <div className="features">
              <div><CheckCircle2 size={18} /> Secure Role-Based Access</div>
              <div><CheckCircle2 size={18} /> Registeration Management</div>
              <div><CheckCircle2 size={18} /> Student & Teacher Dashboards</div>
              <div><CheckCircle2 size={18} /> Attendance & Academics</div>
            </div>
          </div>
        </div>

        <div className="curve-divider" />

        {/* RIGHT */}
        <div className="login-right">
          <form className="login-card" onSubmit={handleSubmit}>
            <div className="login-header">
              
              <h2>Welcome Back</h2>
              <p>Sign in to continue</p>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="form-input"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-footer">
              <label>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />{" "}
                Remember Me
              </label>

              <a href="/forgot-password">Forgot Password?</a>
            </div>

            <button className="login-button" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Login;
