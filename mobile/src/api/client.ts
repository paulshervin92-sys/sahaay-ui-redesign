// NOTE: Install @react-native-async-storage/async-storage before using
// npm install @react-native-async-storage/async-storage
let AsyncStorage: any;
try {
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
} catch {
  // Fallback for when module is not installed yet
  AsyncStorage = {
    getItem: async () => null,
    setItem: async () => {},
    removeItem: async () => {},
  };
}

// API Configuration
const isDevelopment = typeof __DEV__ !== 'undefined' 
  ? __DEV__ 
  : (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development');

// ⚠️ IMPORTANT: Update PRODUCTION_API_URL with your deployed backend URL
const PRODUCTION_API_URL = 'https://sahaay-ai-y9v3.onrender.com'; // 👈 CHANGE THIS TO YOUR DEPLOYED URL

const API_BASE_URL = isDevelopment
  ? 'http://10.0.2.2:3000'  // Development (emulator/local testing)
  : PRODUCTION_API_URL;      // Production (APK for distribution)

export interface ApiError extends Error {
  status?: number;
  details?: unknown;
}

/**
 * Build full API URL from path
 */
const buildUrl = (path: string): string => {
  return `${API_BASE_URL}${path}`;
};

/**
 * Get authentication token from storage
 */
const getAuthToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('authToken');
  } catch (error) {
    console.error('Failed to get auth token:', error);
    return null;
  }
};

/**
 * Store authentication token
 */
export const setAuthToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem('authToken', token);
  } catch (error) {
    console.error('Failed to store auth token:', error);
  }
};

/**
 * Remove authentication token
 */
export const removeAuthToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('authToken');
  } catch (error) {
    console.error('Failed to remove auth token:', error);
  }
};

/**
 * Main API fetch function
 * Similar to web version but uses token-based auth instead of cookies
 */
export const apiFetch = async <T>(
  path: string,
  options?: RequestInit
): Promise<T> => {
  const token = await getAuthToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string> || {}),
  };

  // Add authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(buildUrl(path), {
      ...options,
      headers,
    });

    if (!response.ok) {
      const err: ApiError = new Error('API request failed');
      err.status = response.status;
      
      try {
        err.details = await response.json();
      } catch {
        err.details = undefined;
      }
      
      // If unauthorized, clear token
      if (response.status === 401) {
        await removeAuthToken();
      }
      
      throw err;
    }

    return response.json() as Promise<T>;
  } catch (error) {
    console.error('API fetch error:', error);
    throw error;
  }
};

/**
 * Upload file with multipart/form-data
 */
export const uploadFile = async <T>(
  path: string,
  file: File | Blob,
  additionalData?: Record<string, any>
): Promise<T> => {
  const token = await getAuthToken();
  const formData = new FormData();
  
  formData.append('file', file as any);
  
  if (additionalData) {
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, JSON.stringify(value));
    });
  }

  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(buildUrl(path), {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    const err: ApiError = new Error('Upload failed');
    err.status = response.status;
    throw err;
  }

  return response.json() as Promise<T>;
};
