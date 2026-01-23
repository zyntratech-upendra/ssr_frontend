import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, ArrowLeft } from 'lucide-react';
import { forgotPassword } from '../services/authService';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const response = await forgotPassword(email);
      if (response.success) {
        setSuccess('Password reset instructions have been sent to your email');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (err) {
      setError(err.message || 'Failed to send reset instructions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="login-logo">
            <GraduationCap className="logo-icon" size={60} />
          </div>
          <h1 className="login-title">Forgot Password</h1>
          <p className="login-tagline">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={`form-input ${error ? 'error' : ''}`}
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
                setSuccess('');
              }}
            />
          </div>

          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}

          <button
            type="submit"
            className={`btn btn-primary login-button ${loading ? 'btn-loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Instructions'}
          </button>

          <div style={{ marginTop: 'var(--spacing-lg)', textAlign: 'center' }}>
            <a href="/login" className="link" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
              <ArrowLeft size={16} />
              Back to Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
