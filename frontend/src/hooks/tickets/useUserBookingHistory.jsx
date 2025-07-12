// React, dependencies & packages
import { useEffect, useState } from "react"

// App
import { useAuthContext } from "@/contexts/AuthContext"
import { ticketService } from "@/services/tickets/ticketService"

// Components here


export const useUserBookingHistory = () => {
  const { accessToken } = useAuthContext()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getUserBookingHistory = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await ticketService.getUserBookingHistory()
      setBookings(response.data)
      console.log("Get User Booking History successful:", response.data)
    } catch (error) {
      setError("Something went wrong while getting bookings history. Please try again.")
      console.error("Get User Booking History unsuccessful:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!accessToken) return
    getUserBookingHistory()
  }, [accessToken])

  return { bookings, loading, error, refetch: getUserBookingHistory }
}