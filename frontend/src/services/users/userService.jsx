// API
import api from "../Api"

// Components here

export const userService = {
  // Staff
  getUsers: () => api.get(`/users/`),
  updateUserGroup: (userId, action) => api.patch(`/users/user/update/${userId}/`, { groups: action }),
  setCashierCity: (userId, city) => api.patch(`/users/user/update-city/${userId}/`, { city: city }),
}