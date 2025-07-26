// API
import api from "../Api"

// Components here

export const userService = {
  readUsers: () => api.get(`/v1/users/`),
  updateUser: (userId, group, city) => api.patch(`/v1/users/${userId}/`, { groups: group, city: city })
}