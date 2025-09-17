'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '@/lib/api';

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (token && userData) {
          setUser(JSON.parse(userData));
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  

const login = async (credentials) => {
  try {
    const response = await authApi.login(credentials.email, credentials.password);
    const { token, user: userData } = response.data;
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  } catch (err) {
    // Check if it's a blocked user error
    if (err.response?.status === 403) {
      // Store blocked user info and redirect
      localStorage.setItem('blocked_user', JSON.stringify({
        email: credentials.email,
        message: err.response?.data?.message || 'Account blocked'
      }));
      window.location.href = '/blocked';
      return; // Important: return early to prevent further error handling
    }
    throw err; // Re-throw other errors
  }
};

  const signup = async (userData) => {
    try {
      await authApi.signup(userData);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
