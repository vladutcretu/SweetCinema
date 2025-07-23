// React, dependencies & packages
import { useState } from "react"

// App
import { bookingService } from "@/services/tickets/bookingService"

// Components here


export const useUpdateBooking = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const updateBooking = async (bookingId) => {
    setLoading(true)
    setError(null)
    setData(null)
    try {
      const response = await bookingService.updateBooking(bookingId)
      setData(response.data)
      console.log("User - Update Booking successful:", response.data)
      return response.data
    } catch (error) {
      setError("Something went wrong while canceling the booking. Please try again.")
      console.error("User - Update Booking unsuccessful:", error)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { updateBooking, loading, error, data }
}