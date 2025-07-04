// App
import { useAuthContext } from "../contexts/AuthContext"
const api_url = import.meta.env.VITE_API_URL

// Write components here


function TicketReserve({ showtimeId, seatIds, onSuccess }) {
    const { accessToken } = useAuthContext()

    const postTicketReserve = async () => {
        if (!accessToken) {
            alert('You must be logged in to reserve a ticket.')
        }

        try {
            const response = await fetch(`${api_url}/tickets/reserve/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({showtime_id: showtimeId, seat_ids: seatIds})
            })
            if (!response.ok) {
                const errorData = await response.json()
                console.error('Reservation failed:', errorData)
                alert('Reservation failed: ' + (errorData?.detail || response.status))
            } else {
                console.log('Booking created.')
                alert('Seat reserved successfully!') 
                // Apply onSuccess() function when got onSucces response to re-render SeatPresentation component
                if (onSuccess) onSuccess()
            }
        } catch (error) {
            console.error('Network error:', error)
            alert('Something went wrong while reserving the seat.')
        }
    }

    return (
        <>
            <button onClick={postTicketReserve}>Reserve ticket</button>
        </>
    )
}

export default TicketReserve
