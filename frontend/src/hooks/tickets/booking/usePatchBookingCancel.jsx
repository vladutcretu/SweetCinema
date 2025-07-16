// React, dependencies & packages
import { useState } from "react"

// App
import { bookingService } from "@/services/tickets/bookingService"

// Components here


export const usePatchBookingCancel = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const patchBookingCancel = async (bookingId) => {
    setLoading(true)
    setError(null)
    try {
      const response = await bookingService.patchBookingCancel(bookingId)
      setData(response.data)
      console.log("Update User Booking successful:", response.data)
      return response.data
    } catch (error) {
      setError("Something went wrong while canceling booking. Please try again.")
      console.error("Update User Booking unsuccessful:", error)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { patchBookingCancel, loading, error, data }
}