// API
import api from "../Api"

// Components here


export const cityService = {
  getCities: () => api.get(`/locations/cities/`),

  // Staff: CRUD
  createCity: (name) => api.post(`/locations/cities/create/`, { name: name }),
  readCities: () => api.get(`/locations/cities/`),
  updateCity: (cityId, name) => api.put(`/locations/cities/${cityId}/`, { name: name }),
  deleteCity: (cityId) => api.delete(`/locations/cities/${cityId}/`),
}