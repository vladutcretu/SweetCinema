// API
import api from "../Api"

// Components here


export const theaterService = {
  readTheaters: () => api.get(`/v1/locations/theaters/`),
  createTheater: (name, city, rows, columns) => api.post(`/v1/locations/theaters/`, { 
    name: name, 
    city: city, 
    rows: rows,
    columns: columns 
  }),
  updateTheater: (theaterId, name, rows, columns) => api.patch(`/v1/locations/theaters/${theaterId}/`, { 
    name: name, 
    rows: rows, 
    columns: columns
   }),
  deleteTheater: (theaterId) => api.delete(`/v1/locations/theaters/${theaterId}/`),
}