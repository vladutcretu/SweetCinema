// React, dependencies & packages 
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"

// App 
const api_url = import.meta.env.VITE_API_URL

// Write components here


function TicketPayment({ bookingId, paymentAmount, paymentMethod }) {

    const postTicketPayment = async () => {
        const accessToken = localStorage.getItem('access_token')
        if (!accessToken) {
            console.error('Can not get access token.')
            return
        }

        try {
            const response = await fetch(`${api_url}/tickets/pay/${bookingId}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    amount: paymentAmount, 
                    method: paymentMethod
                })
            })
            if (!response.ok) {
                const errorData = await response.json()
                console.error('Payment failed:', errorData)
                alert('Payment failed: ' + (errorData?.detail || response.status)) 
            } else {
                console.log('Payment completed.')
                alert('Payment successfully!')
            }
        } catch (error) {
            console.error('Network error:', error)
            alert('Something went wrong while paying the seat.')
        }
    }

    return (
        <>
            <button onClick={postTicketPayment}>Pay {paymentAmount} RON</button>
        </>
    )

}

function PaymentMethodSelector({ onSelect }) {
    const [method, setMethod] = useState('visa')

    const handleChange = (event) => {
        const selectedMethod = event.target.value
        setMethod(selectedMethod)
        onSelect(selectedMethod)
    }

    return (
        <form>
            <label htmlFor="payment-method">Select payment method:</label>
            <select id="payment-method" value={method} onChange={handleChange}>
                {/* Fetch this data from backend at some point */}
                <option value="visa">VISA</option>
                <option value="mastercard">MasterCard</option>
            </select>
        </form>
    )
}

function BookingPresentation() {
    // Get Booking ID parameter to fetch with it
    const { bookingId } = useParams()

    // Get access token value to fetch with it
    const accessToken = localStorage.getItem('access_token')
    if (!accessToken) {
        console.error('Can not get access token.')
        return
    }

    // Fetch Booking data for Booking presentation
    const [booking, setBooking] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const getBookingDetail = async() => {
            try {
                const response = await fetch(`${api_url}/tickets/booking/${bookingId}/`, {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    },
                    body: JSON.stringify()
                })
                if (!response.ok) {
                    throw new Error(`HTTP error! Response status: ${response.status}`)
                } else {
                    const data = await response.json()
                    console.log(data)
                    setBooking(data)
                }
            } catch (error) {
                console.error('Fetching Booking error', error)
                setError('Booking cannot be loaded. Please try again!')
            } finally {
                setLoading(false)
            }
        }
        
        getBookingDetail()
    }, [bookingId])

    // Get user selection of PaymentMethodSelector component
    const [paymentMethod, setPaymentMethod] = useState('visa')

    return (
        <>
        {loading && <p>Booking detail is loading</p>}
        {error && <p>{error}</p>}
        {!loading && !error && booking && (
            <div style={{ backgroundColor: "darkblue" }}>
                <h1>Payment page for Booking ID {booking.id} - status: {booking.status}</h1>
                <h3>Showtime informations: {booking.showtime.movie.title}, {booking.showtime.date} {booking.showtime.time} -  {booking.showtime.theater.name} ({booking.showtime.theater.city.name}) </h3>
                <h3>Seat informations: row {booking.seat.row}, column {booking.seat.column}</h3>

                <PaymentMethodSelector onSelect={setPaymentMethod} />

                <TicketPayment bookingId={booking.id} paymentAmount={booking.showtime.price} paymentMethod={paymentMethod} />
            </div>
        )}
        </>
    )
}

function PaymentCreate() {
    return (
        <>
        <BookingPresentation />
        </>
    )
}

export default PaymentCreate
