// React, dependencies & packages
import { useEffect, useState } from "react"

// App
import { bookingService } from "@/services/tickets/bookingService"

// Components here


export const useReadPaymentBookings = (bookingIds) => {
  const [bookings, setBookings] = useState({})
  const [totalPrice, setTotalPrice] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const readPaymentBookings = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await bookingService.readPaymentBookings(bookingIds)
      setBookings(response.data.bookings)
      setTotalPrice(response.data.total_price)
      console.log("User - Read Payment Bookings successful:", response.data)
      return response.data
    
    } catch (error) {
      if (error.response?.data) {
        const backendErrors = error.response.data
        const errorMessages = Object.values(backendErrors).flat().join("\n")
        setError(`Something went wrong while getting payment bookings: ${errorMessages}`)
      } else {
        setError("Something went wrong while getting payment bookings Please try again.")
      }
      console.error("User - Read Payment Bookings unsuccessful:", error)
      return null
    
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
      readPaymentBookings(bookingIds)
  }, [bookingIds])

  return { 
    bookings, 
    totalPrice, 
    loading, 
    error 
  }
}