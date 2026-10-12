import axios from "axios";

const BASE_URL = "http://localhost:8080";

// Main API instance
const API = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
});

// Separate instance for refreshing tokens
// This prevents the refresh request from triggering
// the main response interceptor.
const refreshAPI = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

let refreshPromise = null;
let logoutInProgress = false;

// =====================================================
// LOGOUT
// =====================================================

function logout() {
  if (logoutInProgress) return;

  logoutInProgress = true;

  [
    "token",
    "accessToken",
    "refreshToken",
    "userId",
    "userName",
    "userEmail",
    "userRole",
    "user",
  ].forEach((key) => localStorage.removeItem(key));

  window.location.replace("/login");
}

// =====================================================
// ATTACH ACCESS TOKEN TO EVERY MAIN API REQUEST
// =====================================================

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// =====================================================
// REFRESH ACCESS TOKEN
// =====================================================

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    const error = new Error("Refresh token not found");
    error.authFailure = true;
    throw error;
  }

  console.log("Calling refresh API...");

  try {
    const response = await refreshAPI.post(
      "/api/auth/refresh",
      { refreshToken }
    );

    const data = response.data;

    if (!data?.accessToken) {
      throw new Error("Access token missing from refresh response");
    }

    // Save the new access token
    localStorage.setItem("token", data.accessToken);

    // Save the returned refresh token if provided
    if (data.refreshToken) {
      localStorage.setItem("refreshToken", data.refreshToken);
    }

    // Update user information if returned
    if (data.userId != null) {
      localStorage.setItem("userId", String(data.userId));
    }

    if (data.name) {
      localStorage.setItem("userName", data.name);
    }

    if (data.role) {
      localStorage.setItem("userRole", data.role);
    }

    console.log("Access token refreshed successfully");

    return data.accessToken;
  } catch (error) {
    const status = error.response?.status;

    console.error(
      "Refresh API failed:",
      status || error.message,
      error.response?.data || ""
    );

    // Only clear the session when the server explicitly
    // rejects the refresh token.
    if (status === 401 || status === 403) {
      error.authFailure = true;
    }

    throw error;
  }
}

// =====================================================
// HANDLE EXPIRED ACCESS TOKEN
// =====================================================

API.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (!originalRequest || status !== 401) {
      return Promise.reject(error);
    }

    // Do not refresh login or refresh requests themselves
    const url = originalRequest.url || "";

    if (
      url.includes("/api/auth/login") ||
      url.includes("/api/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    // Do not retry the same request more than once
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      // Reuse the same refresh request for concurrent 401s
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }

      const newAccessToken = await refreshPromise;

      // Retry original request with the new access token
      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      return API(originalRequest);
    } catch (refreshError) {
      console.error(
        "Token refresh failed:",
        refreshError.response?.status || refreshError.message
      );

      // Do not log out on network/server errors.
      // Log out only if the refresh token is rejected.
      if (refreshError.authFailure) {
        logout();
      }

      return Promise.reject(refreshError);
    }
  }
);

// =====================================================
// ROUTE STOPS API
// =====================================================

export const getRouteStops = async (routeId) => {
  const response = await API.get(
    `/api/routes/${routeId}/stops`
  );

  return response.data;
};

export default API;
