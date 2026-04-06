import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';

const UserContext = createContext();

// Centralized API instance
export const API = axios.create({
  baseURL: 'https://student-notification-system-1.onrender.com',
});

// Automatically attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  }, []);

  const syncUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await API.get('/api/users/me');
      // Force HTTPS for Cloudinary images
      const userData = {
        ...res.data,
        profilePic: res.data.profilePic?.replace('http://', 'https://')
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (err) {
      console.error("Profile sync failed", err);
      if (err.response?.status === 401) logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    syncUser();
  }, [syncUser]);

  return (
    <UserContext.Provider value={{ user, setUser, loading, syncUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);