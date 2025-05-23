import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/apiConfig';

// ApiService handles all HTTP requests and token management
class ApiService {
  private axiosInstance: AxiosInstance;

  constructor() {
    // Create axios instance with base config
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    this.setupInterceptors();
  }

  // Attach token to requests and handle token refresh on 401
  private setupInterceptors() {
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as typeof error.config & { _retry?: boolean };
        
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            const refreshToken = await AsyncStorage.getItem('refreshToken');
            if (!refreshToken) {
              await this.clearAuthTokens();
              return Promise.reject(error);
            }

            const response = await this.refreshToken(refreshToken);
            const { accessToken, refreshToken: newRefreshToken } = response.data.data;
            
            await this.storeAuthTokens(accessToken, newRefreshToken);
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            
            return this.axiosInstance(originalRequest);
          } catch (refreshError) {
            await this.clearAuthTokens();
            return Promise.reject(refreshError);
          }
        }
        
        return Promise.reject(error);
      }
    );
  }

  // Store tokens in AsyncStorage
  async storeAuthTokens(accessToken: string, refreshToken: string) {
    await AsyncStorage.multiSet([
      ['accessToken', accessToken],
      ['refreshToken', refreshToken],
    ]);
  }

  // Remove tokens from AsyncStorage
  async clearAuthTokens() {
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
  }

  // ----------- API ENDPOINTS ------------

  // Auth endpoints (signup, login, refresh, etc.)
  async signUp(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    profileImage?: any;
  }) {
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('firstName', data.firstName);
    formData.append('lastName', data.lastName);
    
    if (data.profileImage) {
      formData.append('profileImage', {
        uri: data.profileImage.uri,
        type: data.profileImage.type || 'image/jpeg',
        name: data.profileImage.name || 'profile.jpg',
      } as any);
    }

    return this.axiosInstance.post('/api/auth/signup', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  // Verify OTP for email verification
  async verifyOtp(email: string, otp: string) {
    return this.axiosInstance.post('/api/auth/verify-otp', { email, otp });
  }

  // Resend OTP for email verification
  async resendOtp(email: string) {
    return this.axiosInstance.post('/api/auth/resend-verification-otp', { email });
  }

  // Login with email and password
  async login(email: string, password: string) {
    return this.axiosInstance.post('/api/auth/login', { 
      email, 
      password,
      token_expires_in: "1y" 
    });
  }

  // Refresh access token using refresh token
  async refreshToken(refreshToken: string) {
    return this.axiosInstance.post('/api/auth/refresh-token', { 
      refreshToken,
      token_expires_in: "1y"
    });
  }

  // Logout user and remove tokens
  async logout() {
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    if (refreshToken) {
      await this.axiosInstance.post('/api/auth/logout', { refreshToken });
    }
    await this.clearAuthTokens();
  }

  // Send forgot password email with link to reset password
  async forgotPassword(email: string) {
    return this.axiosInstance.post('/api/auth/forgot-password', { email });
  }

  // User endpoints (profile get/update)
  async getProfile(userId?: string) {
    const endpoint = userId ? `/api/user/profile/${userId}` : '/api/user/profile';
    return this.axiosInstance.get(endpoint);
  }


  // Update user profile with new data
  async updateProfile(data: {
    firstName: string;
    lastName: string;
    profileImage?: any;
  }) {
    const formData = new FormData();
    formData.append('firstName', data.firstName);
    formData.append('lastName', data.lastName);
    
    // If profile image is changed, append it to the form data
    if (data.profileImage) {
      formData.append('profileImage', {
        uri: data.profileImage.uri,
        type: data.profileImage.type || 'image/jpeg',
        name: data.profileImage.name || `profile_${Date.now()}.jpg`,
      } as any);
    }
  
    return this.axiosInstance.put('/api/user/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  // Products endpoints (CRUD)
  async getProducts(page = 1, limit = 10) {
    return this.axiosInstance.get('/api/products', {
      params: { page, limit }
    });
  }
  // Search for products by title and description
  async searchProducts(query: string) {
    return this.axiosInstance.get('/api/products/search', {
      params: { query }
    });
  }

  // Get a product by its ID
  async getProductById(id: string) {
    return this.axiosInstance.get(`/api/products/${id}`);
  }

  // Create a new product
  async createProduct(data: {
    title: string;
    description: string;
    price: number;
    location: {
      name: string;
      longitude: number;
      latitude: number;
    };
    images: any[];
  }) {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('price', data.price.toString());
    formData.append('location', JSON.stringify(data.location));
    
    data.images.forEach((image, index) => {
      formData.append('images', {
        uri: image.uri,
        type: image.type || 'image/jpeg',
        name: image.name || `product_${index}.jpg`,
      } as any);
    });

    return this.axiosInstance.post('/api/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }


  async updateProduct(id: string, data: {
    title?: string;
    description?: string;
    price?: number;
    location?: {
      name: string;
      longitude: number;
      latitude: number;
    };
    images?: any[];
  }) {
    const formData = new FormData();
    if (data.title) formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    if (data.price) formData.append('price', data.price.toString());
    if (data.location) formData.append('location', JSON.stringify(data.location));
    
    if (data.images) {
      data.images.forEach((image, index) => {
        // Only append new images (those with uri)
        if (image.uri) {
          formData.append('images', {
            uri: image.uri,
            type: image.type || 'image/jpeg',
            name: image.name || `product_${index}.jpg`,
          } as any);
        }
      });
    }
  
    return this.axiosInstance.put(`/api/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      transformRequest: () => formData, 
    });
  }

  async deleteProduct(id: string) {
    return this.axiosInstance.delete(`/api/products/${id}`);
  }
}

export const apiService = new ApiService();