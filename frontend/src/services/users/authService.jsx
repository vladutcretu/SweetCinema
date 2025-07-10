// API
import api from "../Api"

// Components here


export const authService = {
  authGoogle: (code) => api.post(`/users/auth-google/`, { code }),
}