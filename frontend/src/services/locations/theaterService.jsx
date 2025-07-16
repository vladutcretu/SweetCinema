// API
import api from "../Api"

// Components here


export const theaterService = {
  // Staff: CRUD
  createTheater: (name, city, rows, columns) => api.post(`/locations/theaters/create/`, { 
    name: name, 
    city: city, 
    rows: rows,
    columns: columns 
  }),
  readTheaters: () => api.get(`/locations/theaters/`),
  updateTheater: (theaterId, name, rows, columns) => api.patch(`/locations/theaters/staff/${theaterId}/`, { 
    name: name, 
    rows: rows, 
    columns: columns
   }),
  deleteTheater: (theaterId) => api.delete(`/locations/theaters/staff/${theaterId}/`),
}