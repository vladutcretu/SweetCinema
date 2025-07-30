// React, dependencies & packages
import { useEffect, useState } from "react"

// App
import { useAuthContext } from "@/contexts/AuthContext"
import { bookingService } from "@/services/tickets/bookingService"

// Components here


export const useReadBookings = () => {
  const { accessToken } = useAuthContext()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const readBookings = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await bookingService.readBookings()
      setBookings(response.data)
      console.log("User - Read Booking History successful:", response.data)
    } catch (error) {
      setError("Something went wrong while getting bookings history. Please try again.")
      console.error("User - Read Booking History unsuccessful:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!accessToken) return
    readBookings()
  }, [accessToken])

  return { bookings, loading, error, refetch: readBookings }
}