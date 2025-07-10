// API
import api from "../Api"

// Components here


export const cityService = {
  getCities: () => api.get(`/locations/cities/`),
}