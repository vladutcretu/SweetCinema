// API
import api from "../Api"

// Components here


export const authService = {
  // User
  authGoogle: (code) => api.post(`/v1/users/auth-google/`, { code }),
  verifyToken: (accessToken) => api.post(`/v1/users/token/verify/`, { token: accessToken }),
  refreshToken: (refreshToken) => api.post(`/v1/users/token/refresh/`, { refresh: refreshToken }),
  getUserData: () => api.get(`v1/users/me/`),

  // Staff
  setPassword: (password) => api.post(`/v1/users/set-password/`, { password: password }),
  verifyPassword: (password) => api.post(`/v1/users/verify-password/`, { password: password }),
  resetPassword: () => api.post(`v1/users/reset-password/`),
}