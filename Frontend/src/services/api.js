
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080",
});

// Separate instance so refresh request does not trigger
// the same response interceptor.
const refreshAPI = axios.create({
  baseURL: "http://localhost:8080",
});

let refreshPromise = null;

// =====================================================
// ATTACH ACCESS TOKEN
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
    throw new Error("Refresh token not found");
  }

  const response = await refreshAPI.post(
    "/api/auth/refresh",
    { refreshToken }
  );

  const data = response.data;

  if (!data?.accessToken) {
    throw new Error("New access token not received");
  }

  localStorage.setItem("token", data.accessToken);

  // Your backend currently returns the same refresh token.
  if (data.refreshToken) {
    localStorage.setItem("refreshToken", data.refreshToken);
  }

  return data.accessToken;
}

// =====================================================
// HANDLE UNAUTHORIZED RESPONSE
// =====================================================

API.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      originalRequest.url?.includes("/api/auth/login") ||
      originalRequest.url?.includes("/api/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      // Share one refresh request if multiple APIs return 401.
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }

      const newAccessToken = await refreshPromise;

      originalRequest.headers =
        originalRequest.headers || {};

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      // Retry the original request once.
      return API(originalRequest);

    } catch (refreshError) {
      [
        "token",
        "refreshToken",
        "userId",
        "userName",
        "userEmail",
        "userRole",
        "user",
      ].forEach((key) => localStorage.removeItem(key));

      window.location.href = "/login";

      return Promise.reject(refreshError);
    }
  }
);

// =====================================================
// ROUTE STOPS
// =====================================================

export const getRouteStops = async (routeId) => {
  const response = await API.get(
    `/api/routes/${routeId}/stops`
  );

  return response.data;
};

export default API;
