import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../constants/config';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error('Network or Request Error:', {
        message: error.message,
        config: error.config,
      });
      return Promise.reject({
        message: 'Network error or invalid request. Please check your connection or try again later.',
      });
    }

    console.error('API Error:', {
      status: error.response.status,
      data: error.response.data,
    });

    return Promise.reject(error.response);
  }
);

export default apiClient;
