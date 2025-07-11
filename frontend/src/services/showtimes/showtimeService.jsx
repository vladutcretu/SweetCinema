// API
import api from "../Api"

// Components here


export const showtimeService = {
    getMovieShowtimesByCity: (movieId, cityId) => api.get(`/showtimes/?movie=${movieId}&theater__city=${cityId}`),
    getShowtime: (id) => api.get(`/showtimes/${id}`),
    getShowtimeSeats: (id) => api.get(`/showtimes/${id}/seats/`),
}