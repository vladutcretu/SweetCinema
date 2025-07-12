// React, dependencies & packages
import { useEffect, useState } from "react"

// App
import { ticketService } from "@/services/tickets/ticketService"

// Components here


export const useUserCancelBooking = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const updateUserCancelBooking = async (bookingId) => {
    setLoading(true)
    setError(null)
    try {
      const response = await ticketService.updateUserCancelBooking(bookingId)
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

  return { updateUserCancelBooking, loading, error, data }
}