const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export interface ApiError extends Error {
  status?: number;
  details?: unknown;
}

const buildUrl = (path: string) => {
  if (!API_BASE_URL) return path;
  return `${API_BASE_URL.replace(/\/$/, "")}${path}`;
};

export const apiFetch = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(buildUrl(path), {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
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
    throw err;
  }

  return response.json() as Promise<T>;
};
