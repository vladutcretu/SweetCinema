// React, dependencies & packages
import { useEffect, useState } from "react"

// App
import { useAuthContext } from "@/contexts/AuthContext"
import { bookingService } from "@/services/tickets/bookingService"

// Components here


export const useGetBookingHistory = () => {
  const { accessToken } = useAuthContext()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getBookingHistory = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await bookingService.getBookingHistory()
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
    getBookingHistory()
  }, [accessToken])

  return { bookings, loading, error, refetch: getBookingHistory }
}