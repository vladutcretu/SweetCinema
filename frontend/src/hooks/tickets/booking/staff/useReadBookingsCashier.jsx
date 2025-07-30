// React, dependencies & packages
import { useEffect, useState } from "react"

// App
import { useAuthContext } from "@/contexts/AuthContext"
import { bookingService } from "@/services/tickets/bookingService"

// Components here


export const useReadBookingsCashier = (cashierCity) => {
  const { accessToken } = useAuthContext()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const readBookingsCashier = async (cashierCity) => {
    try {
      setLoading(true)
      setError(null)
      const response = await bookingService.readBookingsCashier(cashierCity)
      setBookings(response.data)
      console.log("Staff / Cashier - Read Bookings Cashier successful:", response.data)
    } catch (error) {
      setError('Bookings for Cashier cannot be loaded. Please try again!')
      console.error('Staff / Cashier - Read Bookings Cashier unsuccessful:', error)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    readBookingsCashier(cashierCity)
  }, [accessToken, cashierCity])

  return { bookings, loading, error, refetch: readBookingsCashier }
}