const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
const TOKEN_KEY = "sahaay_session_token";
const DEFAULT_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 2;

export interface ApiError extends Error {
  status?: number;
  details?: unknown;
  isTimeout?: boolean;
  isNetworkError?: boolean;
}

const buildUrl = (path: string) => {
  if (!API_BASE_URL) return path;
  return `${API_BASE_URL.replace(/\/$/, "")}${path}`;
};

const getAuthHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  
  // Add Authorization header if token exists (for production cross-origin)
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  } catch (e) {
    // Ignore localStorage errors
  }
  
  return headers;
};

const fetchWithTimeout = async (
  url: string,
  options: RequestInit & { timeout?: number } = {}
): Promise<Response> => {
  const { timeout = DEFAULT_TIMEOUT, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      const err: ApiError = new Error('Request timeout');
      err.isTimeout = true;
      throw err;
    }
    throw error;
  }
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const shouldRetry = (error: ApiError, attempt: number): boolean => {
  if (attempt >= MAX_RETRIES) return false;
  
  // Retry on timeout
  if (error.isTimeout) return true;
  
  // Retry on network errors
  if (error.isNetworkError) return true;
  
  // Retry on 5xx errors
  if (error.status && error.status >= 500) return true;
  
  // Retry on rate limit with backoff
  if (error.status === 429) return true;
  
  return false;
};

export const apiFetch = async <T>(
  path: string,
  options?: RequestInit & { timeout?: number; retries?: number }
): Promise<T> => {
  const maxRetries = options?.retries ?? MAX_RETRIES;
  let lastError: ApiError | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Add exponential backoff for retries
      if (attempt > 0) {
        const backoffMs = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        await sleep(backoffMs);
      }

      const response = await fetchWithTimeout(buildUrl(path), {
        credentials: "include",
        headers: {
          ...getAuthHeaders(),
          ...(options?.headers || {}),
        },
        ...options,
      });

      if (!response.ok) {
        const err: ApiError = new Error("API request failed");
        err.status = response.status;
        try {
          err.details = await response.json();
        } catch {
          err.details = undefined;
        }
        
        // Don't retry on client errors (except 429)
        if (err.status && err.status >= 400 && err.status < 500 && err.status !== 429) {
          throw err;
        }
        
        lastError = err;
        if (shouldRetry(err, attempt)) {
          continue;
        }
        throw err;
      }

      return response.json() as Promise<T>;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        const err: ApiError = new Error('Network error');
        err.isNetworkError = true;
        lastError = err;
        
        if (shouldRetry(err, attempt)) {
          continue;
        }
        throw err;
      }
      
      // If it's already an ApiError, use it
      if (error instanceof Error && 'status' in error) {
        lastError = error as ApiError;
        if (shouldRetry(lastError, attempt)) {
          continue;
        }
      }
      
      throw error;
    }
  }

  throw lastError || new Error('Request failed after retries');
};
