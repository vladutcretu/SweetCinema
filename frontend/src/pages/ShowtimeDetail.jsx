// React, dependencies & packages
import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"

// App
import { useAuthContext } from "../contexts/AuthContext"
import TicketReserve from "../components/TicketReserve"
import TicketPay from "../components/TicketPay"
const api_url = import.meta.env.VITE_API_URL

// Write components here


function SeatPresentation() {
    // Get Showtime ID parameter to fetch with it
    const { showtimeId } = useParams()

    // Fetch Showtime data for Seat presentation
    const [seats, setSeats] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const getSeatList = async() => {
        try {
            const response = await fetch(`${api_url}/showtimes/${showtimeId}/seats/`)
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

    useEffect(() => {
        getSeatList()
    }, [showtimeId])

    // Use auth status from context to show Reserve/Buy buttons
    const { isAuthenticated } = useAuthContext()

    const statusColors = {
        available: 'lightgreen',
        reserved: 'lightblue',
        purchased: 'lightcoral',
    }

    // Manage seat selected by user 
    const [selectedSeats, setSelectedSeats] = useState([])

    const toggleSeat = (seatId) => {
        setSelectedSeats(prev =>
            prev.includes(seatId) ? prev.filter(id => id !== seatId) : [...prev, seatId]
    )
}

    return (
        <>
        {loading && <p>Seat list is loading</p>}
        {error && <p>{error}</p>}
        {!loading && !error && seats.length === 0 && (<p>Currently there's no seats for this showtime.</p>)}
        {!loading && !error && seats.length > 0 && seats.map(seat => (
            <div key={seat.id} style={{ backgroundColor: statusColors[seat.status] || 'gray', padding: '10px', margin: '10px', borderRadius: '5px' }}>
                <h1>Seat ID {seat.id}: row {seat.row}, column {seat.column} - status: {seat.status}</h1>
                { seat.status === 'available' || seat.status === 'canceled' || seat.status === 'failed_payment' || seat.status === 'expired' ? (
                        <>
                        <input 
                            type="checkbox" 
                            checked={selectedSeats.includes(seat.id)} 
                            onChange={() => toggleSeat(seat.id)} 
                            disabled={seat.status !== 'available' && seat.status !== 'canceled' && seat.status !== 'failed_payment' && seat.status !== 'expired'}
                        />
                        <label>Select</label>
                        </>
                ) : ( <p>Can't reserve / pay a ticket for this seat due to his status.</p> )
                }
            </div>
        ))}
        {isAuthenticated ? (
            <div style={{ marginTop: "20px" }}>
                <TicketReserve showtimeId={showtimeId} seatIds={selectedSeats} onSuccess={getSeatList} />
                <TicketPay showtimeId={showtimeId} seatIds={selectedSeats} />
            </div>
            ) : ( <p>Please log in to reserve or buy a ticket.</p>)
        }
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
                const response = await fetch(`${api_url}/showtimes/${showtimeId}/`)
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
                <p>Ticket price: {showtime.price}</p>
                <>Capacity info: {showtime.theater.rows} rows, {showtime.theater.columns} columns</>
                <SeatPresentation key={showtime.theater.id}/>
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
