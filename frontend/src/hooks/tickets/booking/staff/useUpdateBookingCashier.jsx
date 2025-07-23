// React, dependencies & packages
import { useState } from "react"

// App
import { bookingService } from "@/services/tickets/bookingService"

// Components here


export const useUpdateBookingCashier = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const updateBookingCashier = async (bookingId) => {
    setLoading(true)
    setError(null)
    setData(null)
    try {
      const response = await bookingService.updateBookingCashier(bookingId)
      setData(response.data)
      console.log("Staff / Cashier - Update Booking successful:", response.data)
      return response.data
    } catch (error) {
      setError("Something went wrong while updating the booking for Cashier. Please try again.")
      console.error("Staff / Cashier - Update Booking unsuccessful:", error)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { updateBookingCashier, loading, error, data }
}