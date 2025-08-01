// React, dependencies & packages
import { useState } from "react"

// App
import { bookingService } from "@/services/tickets/bookingService"

// Components here


export const useCreateBookingReserve = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const createBookingReserve = async (showtimeId, seatIds, status) => {
    setLoading(true)
    setError(null)
    setData(null)
    try {
      const response = await bookingService.createBooking(showtimeId, seatIds, status)
      setData(response.data)
      console.log("User - Create Booking with status=reserved successful:", response.data)
      return response.data
    } catch (error) {
      setError("Something went wrong while reserving the seats. Please try again.")
      console.error("User - Create Booking with status=reserved unsuccessful:", error)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { createBookingReserve, loading, error, data }
}
