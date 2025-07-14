// API
import api from "../Api"

// Components here


export const showtimeService = {
    getMovieShowtimesByCity: (movieId, cityId) => api.get(`/showtimes/?movie=${movieId}&theater__city=${cityId}`),
    getShowtime: (showtimeId) => api.get(`/showtimes/${showtimeId}`),
    getShowtimeSeats: (showtimeId) => api.get(`/showtimes/${showtimeId}/seats/`),

    // Staff: CRUD
    createShowtime: (movie, theater, price, starts_at) => api.post(`/showtimes/staff/create/`, {
      movie: movie,
      theater: theater, 
      price: price, 
      starts_at: starts_at 
    }),
    readShowtimes: () => api.get(`/showtimes/staff/`),
    updateShowtime: (showtimeId, price, starts_at) => api.patch(`/showtimes/staff/${showtimeId}/`, { 
      price: price, 
      starts_at: starts_at  
    }),
    deleteShowtime: (showtimeId) => api.delete(`/showtimes/staff/${showtimeId}/`),
}