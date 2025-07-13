// API
import api from "../Api"

// Components here


export const authService = {
  // User
  authGoogle: (code) => api.post(`/users/auth-google/`, { code }),
  verifyToken: (accessToken) => api.post(`/users/token/verify/`, { token: accessToken }),
  refreshToken: (refreshToken) => api.post(`/users/token/refresh/`, { refresh: refreshToken }),
  getUserData: () => api.get(`/users/user/`),

  // Staff
  setPasswordStaff: (password) => api.post(`/users/user/set-password/`, { new_password: password }),
  verifyPasswordStaff: (password) => api.post(`/users/user/verify-password/`, { password: password }),
}