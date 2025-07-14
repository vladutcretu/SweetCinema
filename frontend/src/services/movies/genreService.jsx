// API
import api from "../Api"

// Components here


export const genreService = {
    // Staff: CRUD genre
    createGenre: (name) => api.post(`/movies/genres/create/`, { name: name }),
    readGenres: () => api.get(`/movies/genres/`),
    updateGenre: (genreId, name) => api.put(`/movies/genres/${genreId}/`, { name: name }),
    deleteGenre: (genreId) => api.delete(`/movies/genres/${genreId}/`),
}