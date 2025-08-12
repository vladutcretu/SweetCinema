// API
import api from "../Api"

// Components here


export const genreService = {
  readGenres: (page = 1, pageSize = 5, ordering = "name") => api.get(`/v1/movies/genres/`, {
    params: { page, page_size: pageSize, ordering }
  }),
  createGenre: (name) => api.post(`/v1/movies/genres/`, { name: name }),
  updateGenre: (genreId, name) => api.patch(`/v1/movies/genres/${genreId}/`, { name: name }),
  deleteGenre: (genreId) => api.delete(`/v1/movies/genres/${genreId}/`),
}