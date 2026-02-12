import { apiFetch, setAuthToken, removeAuthToken } from './client';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  displayName: string;
}

export interface AuthResponse {
  user: {
    uid: string;
    email: string;
    displayName: string;
  };
  token: string;
  session: string;
}

/**
 * Login with email and password
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await apiFetch<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  
  // Store token for mobile authentication
  if (response.token || response.session) {
    await setAuthToken(response.token || response.session);
  }
  
  return response;
};

/**
 * Sign up new user
 */
export const signup = async (data: SignupData): Promise<AuthResponse> => {
  const response = await apiFetch<AuthResponse>('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  
  if (response.token || response.session) {
    await setAuthToken(response.token || response.session);
  }
  
  return response;
};

/**
 * Logout current user
 */
export const logout = async (): Promise<void> => {
  try {
    await apiFetch('/api/auth/logout', {
      method: 'POST',
    });
  } catch (error) {
    console.error('Logout API error:', error);
  } finally {
    // Always remove token locally
    await removeAuthToken();
  }
};

/**
 * Get current user profile
 */
export const getCurrentUser = async () => {
  return apiFetch<AuthResponse['user']>('/api/auth/me');
};

/**
 * Verify if user is authenticated
 */
export const verifyAuth = async (): Promise<boolean> => {
  try {
    await getCurrentUser();
    return true;
  } catch {
    await removeAuthToken();
    return false;
  }
};
