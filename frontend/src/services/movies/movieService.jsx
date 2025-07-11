// API
import api from "../Api"

// Components here


export const movieService = {
    getMovies: () => api.get(`/movies/`),
    getMovie: (id) => api.get(`/movies/${id}/`),
}