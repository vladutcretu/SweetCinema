// React, dependencies & packages
import React, { useEffect, useState } from 'react'
import { useAuthContext } from '../../contexts/AuthContext'

// App
const api_url = import.meta.env.VITE_API_URL

// Write components here


const BookingHistory = () => {
  // Get context for access 
  const { accessToken } = useAuthContext()
  
  // Fetch booking data 
  const [bookings, setBookings] = useState([])

  // Get booking list
  const getBookingList = async() => {
    try {
      const response = await fetch(`${api_url}/tickets/bookings/history/`, {
        method: 'GET',
        headers: {'Authorization': `Bearer ${accessToken}`}
      })
      if (!response.ok) {
        throw new Error (`HTTP error! Response status: ${response.status}`)
      } else {
        const data = await response.json()
        console.log(data)
        setBookings(data)
      }
    } catch (error) {
      console.error('Fetching Booking error', error)
    }
  }

  useEffect(() => {
    if (accessToken) {
      getBookingList()
    }
  }, [accessToken])


  // Cancel reservation
  const [bookingId, setBookingId] = useState("")
  const handleButton = (bookingId) => {
    setBookingId(bookingId)
  }

  const handleSubmit = (event) => {
      event.preventDefault()
      patchBookingStatus()
    }

  // Fetch booking data to update status
  const patchBookingStatus = async () => {
    try {
      const response = await fetch(`${api_url}/tickets/booking/${bookingId}/cancel/`, {
        method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ status: "canceled" })
            })
            if (!response.ok) {
                const errorData = await response.json()
                console.error('Update booking failed:', errorData)
                alert('Update booking failed: ' + (errorData?.detail || response.status))
            } else {
                const data = await response.json()
                console.log(data)
                alert(`Completed: Booking has been canceled!`)
                // Fetch again
                await getBookingList()
            }
        } catch (error) {
            console.error('Fetching Booking data error', error)
            alert('Something went wrong while canceling booking.')
        }
    }

  return (
    <div>
      <h3>Bookings history</h3>
      
      <table style={{ border: "1px solid black", width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Movie</th>
            <th>Theater, City</th>
            <th>Date, time</th>
            <th>Seat</th>
            <th>Status</th>
            <th>Booking time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td>{booking.id}</td>
              <td>{booking.showtime.movie.title}</td>
              <td>{booking.showtime.theater.name}, {booking.showtime.theater.city.name}</td>
              <td>{booking.showtime.date} {booking.showtime.time}</td>
              <td>R: {booking.seat.row}, C: {booking.seat.column}</td>
              <td>{booking.status}</td>
              <td>Booked on {booking.booked_at}; Last update on: {booking.updated_at}</td>
              {booking.status === "reserved" && 
                <td>
                    <form onSubmit={handleSubmit}><button onClick={() =>handleButton(booking.id)}>Cancel reservation</button></form>
                </td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default BookingHistory
