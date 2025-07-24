// React, dependencies & packages
import { useState } from "react"

// App
import { ticketService } from "@/services/tickets/ticketService"
import { bookingService } from "@/services/tickets/bookingService"

// Components here


export const useCreateBookingPurchase = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const createBookingPurchase = async (showtimeId, seatIds, status) => {
    setLoading(true)
    setError(null)
    setData(null)
    try {
      const response = await bookingService.createBooking(showtimeId, seatIds, status)
      setData(response.data)
      console.log("User - Create Booking with status=pending_payment successful:", response.data)
      return response.data
    } catch (error) {
      setError("Something went wrong while purchasing the seats. Please try again.")
      console.error("User - Create Booking with status=pending_payment unsuccessful:", error)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { createBookingPurchase, loading, error, data }
}
