import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle auth errors


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      // Forbidden - user is probably blocked
      const errorMessage = error.response?.data?.message || '';
      
      if (errorMessage.includes('blocked') || errorMessage.includes('Blocked')) {
        // User is blocked - redirect to blocked page
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('blocked_user', JSON.stringify({
          email: user.email || 'Unknown',
          message: errorMessage
        }));
        window.location.href = '/blocked';
        return Promise.reject(new Error('User blocked')); // Prevent further processing
      }
      
      // Other 403 errors (like permission denied)
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authApi = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  signup: (userData) => api.post("/auth/signup", userData),
};

// Feedback API calls
export const feedbackApi = {
  create: (data) => api.post("/feedback", data),
  getMyFeedback: (page = 1, limit = 5) =>
    api.get(`/feedback/my?page=${page}&limit=${limit}`),
  update: (id, data) => api.put(`/feedback/${id}`, data),
  delete: (id) => api.delete(`/feedback/${id}`),
};

// Admin API calls
// In your existing lib/api.js, add these to adminApi object:
export const adminApi = {
  getStudents: (page = 1, limit = 10, search = "") =>
    api.get(`/admin/students?page=${page}&limit=${limit}&search=${search}`),
  blockStudent: (id, blocked) =>
    api.put(`/admin/students/${id}/block`, { blocked }),
  deleteStudent: (id) => api.delete(`/admin/students/${id}`),
  getDashboardStats: () => api.get("/admin/dashboard-stats"),
  getFeedbackStats: () => api.get("/admin/feedback-stats"),
  exportFeedback: () =>
    api.get("/admin/export-feedback", {
      responseType: "blob", // Important for file downloads
    }),
  getFeedbackTrend: (days = 30) =>
    api.get(`/admin/analytics/feedback-trend?days=${days}`),
  getRatingDistribution: () => api.get("/admin/analytics/rating-distribution"),
};

// Profile API calls
// In your existing lib/api.js, add these to profileApi object:
export const profileApi = {
  getProfile: () => api.get("/profile"),
  updateProfile: (data) => api.put("/profile", data),
  changePassword: (data) => api.put("/profile/change-password", data),
};

// Courses API calls
export const coursesApi = {
  getAll: () => api.get("/courses"),
  create: (data) => api.post("/courses", data),
  update: (id, data) => api.put(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`),
};
