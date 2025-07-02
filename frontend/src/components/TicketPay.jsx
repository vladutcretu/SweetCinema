// React, dependencies & packages
import { useNavigate } from "react-router-dom"

// App
import { useAuthContext } from "../contexts/AuthContext"
const api_url = import.meta.env.VITE_API_URL

// Write components here


function TicketPay({ showtimeId, seatIds }) {
    const navigate = useNavigate()
    const { accessToken } = useAuthContext()

    const postTicketPay = async() => {
        if (!accessToken) {
            alert('You must be logged in to pay a ticket.')
        }

        try {
            const response = await fetch(`${api_url}/tickets/purchase/`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({showtime_id: showtimeId, seat_ids: seatIds})
            })
            if (!response.ok) {
                const errorData = await response.json()
                console.error('Payment failed:', errorData)
                alert('Payment failed: ' + (errorData?.detail || response.status))
            } else {
                const data = await response.json()
                const bookingIds = data.booking_ids
                console.log(bookingIds)
                navigate(`/payment/`, { state: { bookingIds: bookingIds, seatsNumber: bookingIds.length }})
                console.log('Booking created. Should redirect to payment page to complete pay action!')
            }
        } catch (error) {
            console.error('Network error:', error)
            alert('Something went wrong while purchasing the seat.')
        }
    }

    return (
        <>
            <button onClick={postTicketPay}>Pay ticket</button>
        </>
    )
}

export default TicketPay
