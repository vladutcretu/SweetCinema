// API
import api from "../Api"

// Components here


export const theaterService = {
  // Staff
  readTheaters: () => api.get(`/locations/theaters/`),
}