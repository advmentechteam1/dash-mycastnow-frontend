import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AdminAuthContext = createContext(null);

const API_BASE = 'http://localhost:5000/api';

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('admin_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAdminToken = async () => {
      if (!adminToken) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(`${API_BASE}/admin-auth/me`, {
          headers: { Authorization: `Bearer ${adminToken}` },
        });
        setAdmin(res.data.admin);
      } catch {
        localStorage.removeItem('admin_token');
        setAdminToken(null);
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };
    verifyAdminToken();
  }, [adminToken]);

  const loginAdmin = async (email, password) => {
    const res = await axios.post(`${API_BASE}/admin-auth/login`, { email, password });
    const { token: newToken, admin: adminData } = res.data;
    localStorage.setItem('admin_token', newToken);
    setAdminToken(newToken);
    setAdmin(adminData);
    return adminData;
  };

  const logoutAdmin = () => {
    localStorage.removeItem('admin_token');
    setAdminToken(null);
    setAdmin(null);
  };

  const updateAdminState = (updatedFields) => {
    setAdmin((prev) => (prev ? { ...prev, ...updatedFields } : null));
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        adminToken,
        loading,
        loginAdmin,
        logoutAdmin,
        updateAdminState,
        isAdminAuthenticated: !!admin,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used inside AdminAuthProvider');
  return ctx;
};
