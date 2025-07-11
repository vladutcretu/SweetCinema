// API
import api from "../Api"

// Components here


export const movieService = {
    getMovies: () => api.get(`/movies/`),
}