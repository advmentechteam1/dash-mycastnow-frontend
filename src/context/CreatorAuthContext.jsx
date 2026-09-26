import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CreatorAuthContext = createContext(null);

const API_BASE = 'http://localhost:5000/api';

export const CreatorAuthProvider = ({ children }) => {
  const [creator, setCreator] = useState(null);
  const [creatorToken, setCreatorToken] = useState(() => localStorage.getItem('creator_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyCreatorToken = async () => {
      if (!creatorToken) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(`${API_BASE}/creator-auth/me`, {
          headers: { Authorization: `Bearer ${creatorToken}` },
        });
        setCreator(res.data.creator);
      } catch {
        localStorage.removeItem('creator_token');
        setCreatorToken(null);
        setCreator(null);
      } finally {
        setLoading(false);
      }
    };
    verifyCreatorToken();
  }, [creatorToken]);

  const loginCreator = async (email, password) => {
    const res = await axios.post(`${API_BASE}/creator-auth/login`, { email, password });
    const { token: newToken, creator: creatorData } = res.data;
    localStorage.setItem('creator_token', newToken);
    setCreatorToken(newToken);
    setCreator(creatorData);
    return creatorData;
  };

  const registerCreator = async (formData) => {
    const res = await axios.post(`${API_BASE}/creator-auth/register`, formData);
    const { token: newToken, creator: creatorData } = res.data;
    localStorage.setItem('creator_token', newToken);
    setCreatorToken(newToken);
    setCreator(creatorData);
    return creatorData;
  };

  const logoutCreator = () => {
    localStorage.removeItem('creator_token');
    setCreatorToken(null);
    setCreator(null);
  };

  const updateCreatorState = (updatedFields) => {
    setCreator((prev) => (prev ? { ...prev, ...updatedFields } : null));
  };

  return (
    <CreatorAuthContext.Provider
      value={{
        creator,
        creatorToken,
        loading,
        loginCreator,
        registerCreator,
        logoutCreator,
        updateCreatorState,
        isCreatorAuthenticated: !!creator,
      }}
    >
      {children}
    </CreatorAuthContext.Provider>
  );
};

export const useCreatorAuth = () => {
  const ctx = useContext(CreatorAuthContext);
  if (!ctx) throw new Error('useCreatorAuth must be used inside CreatorAuthProvider');
  return ctx;
};
