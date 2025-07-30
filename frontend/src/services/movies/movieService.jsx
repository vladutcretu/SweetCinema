// API
import api from "../Api"

// Components here


export const movieService = {
    readMovies: (cityId) => api.get(`/v1/movies/?city=${cityId}`),
    readMovie: (movieId) => api.get(`/v1/movies/${movieId}/`),
    readMoviesStaff: () => api.get(`/v1/movies/staff/`),
    createMovie: (
        title, 
        description, 
        genres,
        poster,
        director,
        cast,
        release,
        duration,
        parental_guide,
        language
    ) => api.post(`/v1/movies/staff/`, {
        title: title, 
        description: description, 
        genres: genres,
        poster: poster, 
        director: director,
        cast: cast,
        release: release,
        duration: duration,
        parental_guide: parental_guide,
        language: language,
    }),
    updateMovie: (
        movieId, 
        title, 
        description, 
        genres,
        poster,
        director,
        cast,
        release,
        duration,
        parental_guide,
        language
    ) => api.patch(`/v1/movies/${movieId}/`, { 
        title: title, 
        description: description, 
        genres: genres,
        poster: poster, 
        director: director,
        cast: cast,
        release: release,
        duration: duration,
        parental_guide: parental_guide,
        language: language,
    }),
    deleteMovie: (movieId) => api.delete(`/v1/movies/${movieId}/`),
}