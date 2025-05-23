import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { apiService } from '../services/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AxiosError } from 'axios';
import { Alert } from 'react-native';

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImage?: {
    url: string;
  };
  isEmailVerified: boolean;
};

type AuthContextType = {
  isLoggedIn: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signUp: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    profileImage?: any;
  }) => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  resendOtp: (email: string) => Promise<void>;
  updateUser: (user: User) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  loading: boolean;
  error: string | null;
  clearError: () => void;
  authChecked: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  const clearError = () => setError(null);
  const updateUser = (userData: User) => setUser(userData);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setLoading(true);
        const accessToken = await AsyncStorage.getItem('accessToken');
        if (accessToken) {
          try {
            const response = await apiService.getProfile();
            setUser(response.data.data.user);
            setIsLoggedIn(true);
          } catch (err) {
            await apiService.clearAuthTokens();
            setIsLoggedIn(false);
            setUser(null);
          }
        }
      } catch (err) {
        console.error('Failed to check auth status:', err);
        await apiService.clearAuthTokens();
        setIsLoggedIn(false);
        setUser(null);
      } finally {
        setLoading(false);
        setAuthChecked(true);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.login(email, password);
      const { accessToken, refreshToken } = response.data.data;

      await apiService.storeAuthTokens(accessToken, refreshToken);
      const profileResponse = await apiService.getProfile();
      setUser(profileResponse.data.data.user);
      setIsLoggedIn(true);
    } catch (err: unknown) {
      handleAuthError(err, 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
      await apiService.clearAuthTokens();
      setUser(null);
      setIsLoggedIn(false);
    } catch (err: unknown) {
      console.error('Logout error:', err);
      await apiService.clearAuthTokens();
      setUser(null);
      setIsLoggedIn(false);
    }
  };

  const signUp = async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    profileImage?: any;
  }) => {
    setLoading(true);
    setError(null);
    try {
      await apiService.signUp(data);
    } catch (err: unknown) {
      handleAuthError(err, 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (email: string, otp: string) => {
    setLoading(true);
    setError(null);
    try {
      await apiService.verifyOtp(email, otp);
    } catch (err: unknown) {
      handleAuthError(err, 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      await apiService.resendOtp(email);
      Alert.alert('Success', 'New verification code sent to your email.');
    } catch (err: unknown) {
      handleAuthError(err, 'Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAuthError = (err: unknown, defaultMessage: string) => {
    let errorMessage = defaultMessage;
    if (err instanceof AxiosError) {
      errorMessage = err.response?.data?.error?.message || errorMessage;
    }
    setError(errorMessage);
    Alert.alert('Error', errorMessage);
    throw err;
  };

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        login,
        logout,
        signUp,
        verifyOtp,
        resendOtp,
        updateUser,
        darkMode,
        toggleDarkMode,
        loading,
        error,
        clearError,
        authChecked,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};