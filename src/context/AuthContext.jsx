import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const API_BASE = 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [superAdmin, setSuperAdmin] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('sa_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(`${API_BASE}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuperAdmin(res.data.superAdmin);
      } catch {
        localStorage.removeItem('sa_token');
        setToken(null);
        setSuperAdmin(null);
      } finally {
        setLoading(false);
      }
    };
    verifyToken();
  }, [token]);

  const login = async (email, password) => {
    const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
    if (res.data.role === 'admin') {
      const { token: newToken, admin: adminData } = res.data;
      localStorage.setItem('admin_token', newToken);
      return { role: 'admin', admin: adminData };
    }
    if (res.data.role === 'creator') {
      const { token: newToken, creator: creatorData } = res.data;
      localStorage.setItem('creator_token', newToken);
      return { role: 'creator', creator: creatorData };
    }
    if (res.data.role === 'user') {
      const { token: newToken, user: userData } = res.data;
      localStorage.setItem('user_token', newToken);
      return { role: 'user', user: userData };
    }
    const { token: newToken, superAdmin: adminData } = res.data;
    localStorage.setItem('sa_token', newToken);
    setToken(newToken);
    setSuperAdmin(adminData);
    return { role: 'superadmin', superAdmin: adminData };
  };

  const logout = () => {
    localStorage.removeItem('sa_token');
    setToken(null);
    setSuperAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ superAdmin, token, loading, login, logout, isAuthenticated: !!superAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
