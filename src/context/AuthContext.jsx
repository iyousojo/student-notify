import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Create an internal axios instance for auth actions (Login/Register)
const authApi = axios.create({
  baseURL: 'https://student-notification-system-1.onrender.com',
});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Check validity on boot
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      setIsAuthenticated(true);
    }
    setIsAuthLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const res = await authApi.post('/api/auth/login', { email, password });
      const { token, user } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setToken(token);
      setIsAuthenticated(true);
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.message || 'Login failed' 
      };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setIsAuthenticated(false);
    // Force a clean redirect to login
    window.location.href = '/login';
  }, []);

  return (
    <AuthContext.Provider value={{ 
      token, 
      isAuthenticated, 
      isAuthLoading, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);