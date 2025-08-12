// API
import api from "../Api"

// Components here

export const userService = {
  readUsers: (page = 1, pageSize = 5, ordering = "-id") => api.get(`/v1/users/`, {
    params: { page, page_size: pageSize, ordering }
  }),
  readUser: (userId) => api.get(`/v1/users/${userId}/`),
  updateUser: (userId, data) => api.patch(`/v1/users/${userId}/`, data)
}