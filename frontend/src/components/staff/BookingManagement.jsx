// React, dependencies & packages
import React, { useState, useEffect } from 'react'

// App
import { useAuthContext } from '../../contexts/AuthContext'
const api_url = import.meta.env.VITE_API_URL

// Write components here


const BookingManagement = () => {
  // Get context for access
  const { accessToken } = useAuthContext()

  // Fetch Booking data
  const [bookings, setBookings] = useState([])
    
  // Get booking list
  const getBookingList = async() => {
    try {
      const response = await fetch(`${api_url}/tickets/bookings/`, {
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
      console.error('Fetching User error', error)
    }
  }

  useEffect(() => {
        getBookingList()
    }, [])

  return (
    <>
    <div style={{ backgroundColor: "#483D8B" }}>
      <h3>BookingManagement</h3>
      <table style={{ border: "1px solid black", width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>User ID</th>
            <th>Showtime</th>
            <th>Seat</th>
            <th>Status</th>
            <th>Booking time</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td>{booking.id}</td>
              <td>{booking.user}</td>
              <td>{booking.showtime.movie.title}: {booking.showtime.theater.name}, {booking.showtime.theater.city.name}, {booking.showtime.date} {booking.showtime.time}</td>
              <td>R: {booking.seat.row}, C: {booking.seat.column}</td>
              <td>{booking.status}</td>
              <td>Booked on {booking.booked_at}; Last update on: {booking.updated_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  )
}

export default BookingManagement
