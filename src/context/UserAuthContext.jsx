import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserAuthContext = createContext(null);

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://dash-mycastnow-backend.onrender.com/api';

export const UserAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userToken, setUserToken] = useState(() => localStorage.getItem('user_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUserToken = async () => {
      if (!userToken) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(`${API_BASE}/user-auth/me`, {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        setUser(res.data.user);
      } catch {
        localStorage.removeItem('user_token');
        setUserToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    verifyUserToken();
  }, [userToken]);

  const loginUser = async (email, password) => {
    const res = await axios.post(`${API_BASE}/user-auth/login`, { email, password });
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem('user_token', newToken);
    setUserToken(newToken);
    setUser(userData);
    return userData;
  };

  const registerUser = async (formData) => {
    const res = await axios.post(`${API_BASE}/user-auth/register`, formData);
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem('user_token', newToken);
    setUserToken(newToken);
    setUser(userData);
    return userData;
  };

  const logoutUser = () => {
    localStorage.removeItem('user_token');
    setUserToken(null);
    setUser(null);
  };

  const updateUserState = (updatedFields) => {
    setUser((prev) => (prev ? { ...prev, ...updatedFields } : null));
  };

  return (
    <UserAuthContext.Provider
      value={{
        user,
        userToken,
        loading,
        loginUser,
        registerUser,
        logoutUser,
        updateUserState,
        isUserAuthenticated: !!user,
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
};

export const useUserAuth = () => {
  const ctx = useContext(UserAuthContext);
  if (!ctx) throw new Error('useUserAuth must be used inside UserAuthProvider');
  return ctx;
};
