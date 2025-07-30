// React, dependencies & packages
import { useEffect, useState } from "react"

// App
import { useAuthContext } from "@/contexts/AuthContext"
import { bookingService } from "@/services/tickets/bookingService"

// Components here


export const useReadBookingsManager = () => {
  const { accessToken } = useAuthContext()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const readBookingsManager = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await bookingService.readBookingsManager()
      setBookings(response.data)
      console.log("Staff / Manager - Read Bookings successful:", response.data)
    } catch (error) {
      setError('Bookings cannot be loaded. Please try again!')
      console.error('Staff / Manager - Bookings unsuccessful:', error)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    readBookingsManager()
  }, [accessToken])

  return { bookings, loading, error }
}