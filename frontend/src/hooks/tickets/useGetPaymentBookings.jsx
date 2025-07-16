// React, dependencies & packages
import { useEffect, useState } from "react"

// App
import { ticketService } from "@/services/tickets/ticketService"

// Components here


export const useGetPaymentBookings = (bookingIds) => {
  const [bookings, setBookings] = useState({})
  const [totalPrice, setTotalPrice] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getPaymentBookings = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await ticketService.getPaymentBookings(bookingIds)
      setBookings(response.data.bookings)
      setTotalPrice(response.data.total_price)
      console.log("Get Payment Bookings successful:", response.data)
      return response.data
    } catch (error) {
      setError("Something went wrong while getting payment bookings. Please try again.")
      console.error("Get Payment Bookings unsuccessful:", error)
      return null
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
      getPaymentBookings(bookingIds)
  }, [bookingIds])

  return { bookings, totalPrice, loading, error }
}