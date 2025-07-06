// React, dependencies & packages
import React, { useState, useEffect } from "react"

// App
import { useAuthContext } from "../../contexts/AuthContext"
const api_url = import.meta.env.VITE_API_URL

const BookingDashboard = () => {
  const { accessToken, user } = useAuthContext()
  const [bookings, setBookings] = useState([])

  // Fetch booking list
  const getBookingList = async () => {
    try {
      const response = await fetch(`${api_url}/tickets/booking/cashier/?city=${user?.city}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      if (!response.ok) {
        throw new Error(`HTTP error! Response status: ${response.status}`)
      }
      const data = await response.json()
      setBookings(data)
    } catch (error) {
      console.error("Fetching bookings error", error)
    }
  }

  useEffect(() => {
      getBookingList()
  }, [])

  // Pay ticket handler
  const postTicketPay = async ( bookingId ) => {
    try {
      const response = await fetch(`${api_url}/tickets/bookings/cashier/${bookingId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ status: "purchased" }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Payment failed:", errorData)
        alert("Payment failed: " + (errorData?.detail || response.status))
      } else {
        const data = await response.json()
        console.log("Payment successful:", data)
        getBookingList()
      }
    } catch (error) {
      console.error("Network error:", error)
      alert("Something went wrong while purchasing the seat.")
    }
  }

  return (
    <div style={{ backgroundColor: "#483D8B", padding: "1rem", color: "white" }}>
      <h3>Booking Management</h3>
      <table style={{ border: "1px solid black", width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>User ID</th>
            <th>Showtime</th>
            <th>Seat</th>
            <th>Status</th>
            <th>Booking Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td>{booking.id}</td>
              <td>{booking.user}</td>
              <td>
                {booking.showtime.movie.title}: {booking.showtime.theater.name},{" "}
                {booking.showtime.theater.city.name}, {booking.showtime.starts_at}
              </td>
              <td>
                R: {booking.seat.row}, C: {booking.seat.column} (ID: {booking.seat.id})
              </td>
              <td>{booking.status}</td>
              <td>
                Booked on {booking.booked_at}
                <br />
                Last update: {booking.updated_at}
              </td>
              <td>
                <button onClick={() => postTicketPay(booking.id)}>
                  Pay ticket
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default BookingDashboard
