import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hydrate = async () => {
      const token = localStorage.getItem('jobtrack_token') || sessionStorage.getItem('jobtrack_token');

      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/auth/me');
        setUser(response.data.user || response.data);
      } catch (error) {
        localStorage.removeItem('jobtrack_token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    hydrate();
  }, []);

  const login = async (credentials, remember = true) => {
    const response = await api.post('/auth/login', credentials);
    const token = response.data.token;
    localStorage.removeItem('jobtrack_token');
    sessionStorage.removeItem('jobtrack_token');
    (remember ? localStorage : sessionStorage).setItem('jobtrack_token', token);
    setUser(response.data.user);
    return response.data;
  };

  const register = async (payload) => {
    const response = await api.post('/auth/register', payload);
    const token = response.data.token;
    if (token) {
      localStorage.setItem('jobtrack_token', token);
      setUser(response.data.user);
    }
    return response.data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // no-op
    } finally {
      localStorage.removeItem('jobtrack_token');
      sessionStorage.removeItem('jobtrack_token');
      setUser(null);
    }
  };

  const value = useMemo(
    () => ({ user, setUser, loading, login, register, logout }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
