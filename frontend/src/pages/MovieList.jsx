import { useEffect, useState } from 'react'
import { Link } from "react-router-dom"

import './MovieList.css'

function MovieCard({ imgSrc, imgAlt, movieTitle, movieDescription, movieGenres, movieId }) {
    return (
        <>
        <div className="movie-card">
            <div className="movie-card-poster">
                <img src={imgSrc} alt={imgAlt}/>
            </div>
            <div className="movie-card-info">
                <h3>{movieTitle}</h3>
                <p>{movieGenres}</p>
                <button><Link to={`/movie/${movieId}`}>See showtimes</Link></button>
            </div>
        </div>
        </>
    )
}

function MovieList() {
    // Fetch Movie data for Movie List grid
    const [movies, setMovies] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const getMovieList = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/movies/`)
                if (!response.ok) {
                    throw new Error (`HTTP error! Response status: ${response.status}`)
                } else {
                    const data = await response.json()
                    console.log(data)
                    setMovies(data)
                }
            } catch (error) {
                console.error('Fetching Movie error', error)
                setError('Movies cannot be loaded. Please try again!')
            } finally {
                setLoading(false)
            }
        }

        getMovieList()
    }, [])

    return (
        <>
        <h1>Newest Movies</h1>
        <div className="movies-grid">
            {loading && <p>Movie list is loading</p>}
            {error && <p>{error}</p>}
            {!loading && !error && movies.length === 0 && (<p>Currently there's no movies to show.</p>)}
            {!loading && !error && movies.length > 0 && movies.map(movie => (
                <MovieCard key={movie.id}
                    imgSrc={movie.poster}
                    imgAlt={movie.title + " poster"}
                    movieTitle={movie.title}
                    movieDescription={movie.description}
                    movieGenres={movie.genres.map(genre => genre.name).join(", ")}
                    movieId={movie.id}
                />
            ))}
        </div>
        </>
    )
}

export default MovieList
