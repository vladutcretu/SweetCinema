// React, dependencies & packages
import { useEffect, useState } from "react"

// App
import { useAuthContext } from "@/contexts/AuthContext"
import { bookingService } from "@/services/tickets/bookingService"

// Components here


export const useReadBookings = () => {
  const { accessToken } = useAuthContext()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const readBookings = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await bookingService.readBookings()
      setBookings(response.data)
      console.log("Read Bookings successful:", response.data)
    } catch (error) {
      setError('Bookings cannot be loaded. Please try again!')
      console.error('Read Bookings unsuccessful:', error)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    readBookings()
  }, [accessToken])

  return { bookings, loading, error }
}