import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-header">
      <div className="header-welcome">
        <p className="welcome-text">Welcome back,</p>
        <h2 className="welcome-name">{user?.name || 'User'}</h2>
      </div>
      <div className="header-actions">
        <span className="user-role-badge">{user?.role || 'User'}</span>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Header;
