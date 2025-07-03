// React, dependencies & packages 
import { useState, useEffect } from "react"
import { data, useLocation, useNavigate } from "react-router-dom"

// App 
import { useAuthContext } from "../contexts/AuthContext"
const api_url = import.meta.env.VITE_API_URL

// Write components here


function TicketPayment({ bookingIds, paymentAmount, paymentMethod }) {
    const navigate = useNavigate()
    const { accessToken } = useAuthContext()

    const postTicketPayment = async () => {
        if (!accessToken) {
            console.error('Can not get access token.')
            return
        }

        try {
            const response = await fetch(`${api_url}/tickets/pay/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    booking_ids: bookingIds,
                    amount: paymentAmount, 
                    method: paymentMethod
                })
            })
            if (!response.ok) {
                const errorData = await response.json()
                console.error('Payment failed:', errorData)
                alert('Payment failed: ' + (errorData?.detail || response.status)) 
            } else {
                const data = await response.json()
                console.log('Payment completed.', data)
                alert('Payment successfully!')
                navigate('/')
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

function TimerToFailedPayment( { bookingIds }) {
    const { accessToken } = useAuthContext()
    const navigate = useNavigate()
    
    const [secondsLeft, setSecondsLeft] = useState(60)

    useEffect(() => {
        if (secondsLeft <= 0) return

        const interval = setInterval(() => {
            setSecondsLeft(prev => prev - 1)
        }, 1000)

        return () => clearInterval(interval)
    }, [secondsLeft])

    const formatTime = () => {
        const mins = Math.floor(secondsLeft / 60)
        const secs = secondsLeft % 60;
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`
    }

    // Fetch to update Bookings to failed_payment status when timer is 0
    useEffect(() => { 
        if (secondsLeft !== 0) return

        const updateBookingStatus = async () => {
            try {
                const response = await fetch(`${api_url}/tickets/pay/timeout/`, {
                    method: 'PUT', 
                    headers : {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                    },
                    body: JSON.stringify({ booking_ids: bookingIds })
                })
                if (!response.ok) {
                    const errorData = await response.json()
                    console.error('Update Booking failed:', errorData)
                    alert('Update Booking failed: ' + (errorData?.detail || response.status))
                } else {
                    const data = await response.json()
                    console.log(data)
                    alert("You did not complete the payment. Please start it again!")
                    navigate('/')
                }
            } catch (error) {
                console.error('Fetching Booking update error', error)
                alert('Something went wrong while updating booking.')
            }
        }

        updateBookingStatus()
    }, [secondsLeft, bookingIds, accessToken])

    return (
    <>
    <div>
        <h3>Complete payment in: {formatTime()}</h3>
    </div>
    </>
    )
}

function BookingPresentation({ bookingIds }) {
    // Get access token value to fetch with it
    const { accessToken } = useAuthContext()
    if (!accessToken) {
        console.error('Can not get access token.')
        return
    }

    // Fetch Booking data for Booking presentation
    const [bookings, setBookings] = useState({})
    const [totalPrice, setTotalPrice] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const getBookingDetail = async () => {
            try {
                const response = await fetch(`${api_url}/tickets/pay/bookings/`, {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    },
                    body: JSON.stringify({ booking_ids: bookingIds })
                })
                if (!response.ok) {
                    throw new Error(`HTTP error! Response status: ${response.status}`)
                } else {
                    const data = await response.json()
                    console.log(data)
                    setBookings(data.bookings)
                    setTotalPrice(data.total_price)
                }
            } catch (error) {
                console.error('Fetching Booking error', error)
                setError('Booking cannot be loaded. Please try again!')
            } finally {
                setLoading(false)
            }
        }
        
        getBookingDetail()
    }, [bookingIds])

    // Get user selection of PaymentMethodSelector component
    const [paymentMethod, setPaymentMethod] = useState('visa')

    return (
        <>
        {loading && <p>Booking detail is loading</p>}
        {error && <p>{error}</p>}
        {!loading && !error && bookings.length == 0  && (<p>There's no bookings to show.</p>)}
        {!loading && !error && bookings.length > 0  && (bookings.map(booking => (
            <div key={booking.id} style={{ backgroundColor: "darkblue" }}>
                <h1>Booking ID {booking.id} - status: {booking.status}</h1>
                <h3>Showtime informations: {booking.showtime.movie.title}, {booking.showtime.starts_at} -  {booking.showtime.theater.name} ({booking.showtime.theater.city.name}) </h3>
                <h3>Seat informations: row {booking.seat.row}, column {booking.seat.column}</h3>
            </div>
        )))}
        <div>
            <PaymentMethodSelector onSelect={setPaymentMethod} /> 
            <br />
            <TimerToFailedPayment bookingIds={bookingIds} />
            <br />
            <TicketPayment bookingIds={bookingIds} paymentAmount={totalPrice} paymentMethod={paymentMethod} />
        </div>
        </>
    )
}

function PaymentCreate() {
    // Get state send via navigate from `TicketPay` component
    const location = useLocation()
    const { bookingIds, seatsNumber } = location.state || {}
    if (!bookingIds || !seatsNumber) {
        return <p>Missing payment information. Please reserve seats first.</p>
    }

    return (
        <>
        <h1>PaymentCreate</h1>
        <h3>Please confirm the payment for {seatsNumber} seats:</h3> {/* seatsNumber == bookingIds.length */}
            <BookingPresentation bookingIds={bookingIds} />
        </>
    )
}

export default PaymentCreate
