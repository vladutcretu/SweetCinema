// API
import api from "../Api"

// Components here


export const showtimeService = {
    readShowtimesByCity: (cityId) => api.get(`/v1/showtimes/?city=${cityId}`),
    readShowtimesByCityMovie: (cityId, movieId) => api.get(`/v1/showtimes/?city=${cityId}&movie=${movieId}`),
    readShowtime: (showtimeId) => api.get(`/v1/showtimes/${showtimeId}`),
    readShowtimeSeats: (showtimeId) => api.get(`/v1/showtimes/${showtimeId}/seats/`),

    readShowtimes: () => api.get(`/v1/showtimes/staff/`),
    createShowtime: (movie, theater, price, starts_at, format, presentation) => api.post(`/v1/showtimes/staff/`, {
      movie: movie,
      theater: theater, 
      price: price, 
      starts_at: starts_at,
      format: format,
      presentation: presentation
    }),
    updateShowtime: (showtimeId, price, starts_at, format, presentation) => api.patch(`/v1/showtimes/${showtimeId}/`, { 
      price: price, 
      starts_at: starts_at,
      format: format,
      presentation: presentation
    }),
    deleteShowtime: (showtimeId) => api.delete(`/v1/showtimes/${showtimeId}/`),
    // Manager
    readShowtimeReport: (showtimeId) => api.get(`/v1/showtimes/${showtimeId}/report/`),
    // cashier
    readShowtimesCashier: (userCity) => api.get(`/v1/showtimes/?city=${userCity}`),
}