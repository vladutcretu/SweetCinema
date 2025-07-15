// API
import api from "../Api"

// Components here

export const userService = {
  // Staff: Read & Update
  readUsers: () => api.get(`/users/`),
  updateStaffGroup: (userId, action) => api.patch(`/users/user/update/${userId}/`, { groups: action }),
  updateStaffCity: (userId, city) => api.patch(`/users/user/update-city/${userId}/`, { city: city }),
}