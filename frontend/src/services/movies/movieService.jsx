// API
import api from "../Api"

// Components here


export const movieService = {
    getMovies: () => api.get(`/movies/`),
    getMovie: (id) => api.get(`/movies/${id}/`),

    // Staff: CRUD
    createMovie: (title, description, genres) => api.post(`/movies/create/`, { 
        title: title, 
        description: description, 
        genres: genres
    }),
    readMovies: () => api.get(`/movies/`),
    updateMovie: (movieId, title, description, genres) => api.patch(`/movies/movie/${movieId}/`, { 
        title: title, 
        description: description, 
        genres: genres
    }),
    deleteMovie: (movieId) => api.delete(`/movies/movie/${movieId}/`),
}