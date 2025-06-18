import { useEffect, useState } from 'react'
import { useParams, Link } from "react-router-dom"

import { useCityContext } from '../contexts/CityContext'

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
                <button>See show time</button>
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

    // Get Movie ID parameter to fetch with it
    const { movieId } = useParams()

    // Get City ID to use saved City data selected by user to fetch with it
    const {selectedCityId} = useCityContext()

    // Fetch Showtime data for Movie Presentation Card
    const [showtimes, setShowtimes] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const getShowtimeList = async() => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/showtimes/?movie=${movieId}&theater__city=${selectedCityId}`)
                if (!response.ok) {
                    throw new Error (`HTTP error! Response status: ${response.status}`)
                }
                else {
                    const data = await response.json()
                    console.log(data)
                    setShowtimes(data)
                }
            } catch (error) {
                console.error('Fetching Showtime error', error)
                setError('Showtimes cannot be loaded. Please try again!')
            } finally {
                setLoading(false)
            }
        }

        getShowtimeList()
    }, [movieId, selectedCityId])

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
                {loading && <p>Showtime list is loading</p>}
                {error && <p>{error}</p>}
                {!loading && !error && showtimes.length === 0 && (<p>Currently there's no show time for this movie.</p>)}
                {!loading && !error && showtimes.length > 0 && showtimes.map(showtime => (
                    <ShowtimeCard key={showtime.id}
                        showtimeDate={showtime.date}
                        showtimeHour={showtime.time}
                        showtimeTheaterName={showtime.theater.name}
                    />
                ))}
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
    {!loading && !error && movie && (
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
