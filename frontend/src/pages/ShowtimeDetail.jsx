// React, dependencies & packages
import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"

// App
import { useAuthContext } from "../contexts/AuthContext"

// Write components here


function SeatPresentation({ theaterId }) {
    // Fetch Showtime data for Seat presentation
    const [seats, setSeats] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const getSeatList = async() => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/locations/seats/?theater=${theaterId}`)
                if (!response.ok) {
                    throw new Error(`HTTP error! Response status: ${response.status}`)
                } else {
                    const data = await response.json()
                    console.log(data)
                    setSeats(data)
                }
            } catch (error) {
                console.error('Fetching Seat error', error)
                setError('Seat cannot be loaded. Please try again!')
            } finally {
                setLoading(false)
            }
        }

        getSeatList()
    }, [theaterId])

    // Use auth status from context to show Reserve/Buy buttons
    const { isAuthenticated } = useAuthContext()

    return (
        <>
        {loading && <p>Seat list is loading</p>}
        {error && <p>{error}</p>}
        {!loading && !error && seats.length === 0 && (<p>Currently there's no seats for this showtime.</p>)}
        {!loading && !error && seats.length > 0 && seats.map(seat => (
            <div key={seat.id} style={{backgroundColor: 'green'}}>
                <h1>Seat ID {seat.id}: row {seat.row}, column {seat.column}</h1>
                {isAuthenticated ? (<button>Reserve a ticket</button>) : (<p>Please log in to reserve a ticket.</p>)}
                {isAuthenticated ? (<button>Buy a ticket</button>) : (<p>Please log in to buy a ticket.</p>)}
            </div>
        ))}
        </>
    )
}

function ShowtimePresentation() {
    // Get Showtime ID parameter to fetch with it
    const { showtimeId } = useParams()

    // Fetch Showtime data for Showtime presentation
    const [showtime, setShowtime] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const getShowtimeDetail = async() => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/showtimes/${showtimeId}/`)
                if (!response.ok) {
                    throw new Error(`HTTP error! Response status: ${response.status}`)
                } else {
                    const data = await response.json()
                    console.log(data)
                    setShowtime(data)
                }
            } catch (error) {
                console.error('Fetching Showtime error', error)
                setError('Showtime cannot be loaded. Please try again!')
            } finally {
                setLoading(false)
            }
        }

        getShowtimeDetail()
    }, [showtimeId])

    return (
        <>
        {loading && <p>Showtime detail is loading</p>}
        {error && <p>{error}</p>}
        {!loading && !error && showtime && (
            <div style={{backgroundColor: "darkblue"}}>
                <h1>Showtime detail ID {showtime.id}: {showtime.date}, {showtime.time} - {showtime.theater.name} ({showtime.theater.city.name})</h1>
                <p>Ticket price: {showtime.price} EUR</p>
                <>Capacity info: {showtime.theater.rows} rows, {showtime.theater.columns} columns</>
                <SeatPresentation key={showtime.theater.id}
                    theaterId={showtime.theater.id}/>
            </div>
        )}
        </>
    )
}

function ShowtimeDetail() {
    return (
        <>
        <ShowtimePresentation />
        <p><Link to={`/`}>Go to Main page</Link></p>
        </>
    )
}

export default ShowtimeDetail