// API
import api from "../Api"

// Components here

export const userService = {
  readUsers: () => api.get(`/v1/users/`),
  readUser: (userId) => api.get(`/v1/users/${userId}/`),
  updateUser: (userId, data) => api.patch(`/v1/users/${userId}/`, data)
}