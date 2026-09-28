import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080",
});

// =====================================================
// AUTOMATICALLY ATTACH JWT TOKEN
// =====================================================

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// =====================================================
// HANDLE UNAUTHORIZED RESPONSE
// =====================================================

API.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    if (error.response?.status === 401) {

      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("userName");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userRole");
      localStorage.removeItem("user");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);
export const getRouteStops = async (routeId) => {
    const response = await fetch(
        `http://localhost:8080/api/routes/${routeId}/stops`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch route");
    }

    return response.json();
};
export default API;