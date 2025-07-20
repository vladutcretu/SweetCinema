// API
import api from "../Api"

// Components here


export const cityService = {
  readCities: () => api.get(`/v1/locations/cities/`),
  createCity: (name, address) => api.post(`/v1/locations/cities/`, { 
    name: name,
    address: address
  }),
  updateCity: (cityId, name, address) => api.patch(`/v1/locations/cities/${cityId}/`, { 
    name: name,
    address: address
  }),
  deleteCity: (cityId) => api.delete(`/v1/locations/cities/${cityId}/`),
}