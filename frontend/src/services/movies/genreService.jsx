// API
import api from "../Api"

// Components here


export const genreService = {
    readGenres: () => api.get(`/v1/movies/genres/`),
    createGenre: (name) => api.post(`/v1/movies/genres/`, { name: name }),
    updateGenre: (genreId, name) => api.patch(`/v1/movies/genres/${genreId}/`, { name: name }),
    deleteGenre: (genreId) => api.delete(`/v1/movies/genres/${genreId}/`),
}