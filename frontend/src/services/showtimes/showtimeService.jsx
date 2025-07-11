// API
import api from "../Api"

// Components here


export const showtimeService = {
    getMovieShowtimesByCity: (movieId, cityId) => api.get(`/showtimes/?movie=${movieId}&theater__city=${cityId}`),
    getShowtime: (showtimeId) => api.get(`/showtimes/${showtimeId}`),
    getShowtimeSeats: (showtimeId) => api.get(`/showtimes/${showtimeId}/seats/`),
}