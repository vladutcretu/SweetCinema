import { useEffect, useState } from 'react'
import { useParams, Link } from "react-router-dom"

import './MovieDetail.css'

function ShowtimeCard({
    showtimeDate,
    showtimeHour,
    showtimeTheaterName,
}) {
    return (
        <>
        <div className="showtimes-grid">
            <div className="showtime-card">
                <h3>{showtimeDate}, {showtimeHour} - {showtimeTheaterName}</h3>
                <button>Get ticket</button>
            </div>
        </div>
        </>
    )
}

function MoviePresentation({ 
    imgSrc,
    imgAlt,
    movieTitle,
    movieGenres,
    movieDescription 
}) {

    return (
    <>
    <div className="movies-grid">
        <div className="movie-card">
            <div className="movie-card-poster">
                <img src={imgSrc} alt={imgAlt}/>
            </div>
        </div>
        <div className="movie-card">
            <div className="movie-card-info">
                <h1>{movieTitle}</h1>
                <h3>{movieGenres}</h3>
                <hr /><br /><hr />
                <h1>Informations</h1>
                <h3>Description: {movieDescription}</h3>
                <h3>Director: </h3>
                <h3>Actors: </h3>
                <h3>Duration: </h3>
                <hr /><br /><hr />
                <h1>Showtimes</h1>
                <ShowtimeCard key={1}
                    showtimeDate="2025-06-14"
                    showtimeHour="17:00"
                    showtimeTheaterName="Hall #1"
                />
                <></>
            </div>
        </div>
    </div>
    </>
    )
}

function MovieDetail() {
    // Get Movie ID parameter to fetch with it
    const { movieId } = useParams()

    // Fetch Movie data for Movie Detail card
    const [movie, setMovie] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const getMovieDetail = async() => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/movies/${movieId}/`)
                if (!response.ok) {
                    throw new Error (`HTTP error! Response status: ${response.status}`)
                } else {
                    const data = await response.json()
                    console.log(data)
                    setMovie(data)
                }
            } catch (error) {
                console.error('Fetching Movie error', error)
                setError('Movie cannot be loaded. Please try again!')
            } finally {
                setLoading(false)
            }
        }

        getMovieDetail()
    }, [movieId])

    return (
    <>
    {loading && <p>Movie detail is loading</p>}
    {error && <p>{error}</p>}
    {movie && (
        <MoviePresentation key={movie.id}
            imgSrc={movie.poster}
            imgAlt={movie.title + " poster"}
            movieTitle={movie.title}
            movieGenres={(movie.genres ?? []).map(genre => genre.name).join(", ")}
            movieDescription={movie.description}
        />
    )}
    <p><Link to={`/`}>Go to Main page</Link></p>
    </>
    )
}

export default MovieDetail