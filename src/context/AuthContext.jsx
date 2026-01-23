import { createContext, useState, useContext, useEffect } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const storedToken = authService.getToken();
      const storedUser = authService.getUser();

      if (storedToken && storedUser) {
        const response = await authService.verifyToken();
        if (response.success) {
          setToken(storedToken);
          setUser(response.user);
        } else {
          logout();
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authService.login(email, password);

      if (response.success) {
        authService.storeToken(response.token);
        authService.storeUser(response.user);
        setToken(response.token);
        setUser(response.user);
        return response;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      setError(error.message || 'Login failed');
      throw error;
    }
  };

  const logout = () => {
    authService.removeToken();
    authService.removeUser();
    setToken(null);
    setUser(null);
    setError(null);
  };

  const value = {
    user,
    token,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user && !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
