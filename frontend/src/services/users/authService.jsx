// API
import api from "../Api"

// Components here


export const authService = {
  authGoogle: (code) => api.post(`/users/auth-google/`, { code }),
  verifyToken: (accessToken) => api.post(`/users/token/verify/`, { token: accessToken }),
  refreshToken: (refreshToken) => api.post(`/users/token/refresh/`, { refresh: refreshToken }),
  getUserData: () => api.get(`/users/user/`),
}