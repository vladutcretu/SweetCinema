// React, dependencies & packages
import { useState } from "react"

// App
import { bookingService } from "@/services/tickets/bookingService"

// Components here


export const useUpdateBooking = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const updateBooking = async (bookingId) => {
    setLoading(true)
    setError(null)

    try {
      const response = await bookingService.updateBooking(bookingId)
      setData(response.data)
      alert(`✅ Booking updated!`)
      console.log("User - Update Booking successful:", response.data)
      return response.data

    } catch (error) {
      if (error.response?.data) {
        const backendErrors = error.response.data
        const errorMessages = Object.values(backendErrors).flat().join("\n")
        setError(`Something went wrong while canceling the booking: ${errorMessages}`)
        alert(`❌ Booking updated!\n${errorMessages}`)
      } else {
        setError("Something went wrong while canceling the booking. Please try again.")
        alert(`❌ Booking updated!`)
      }
      console.error("User - Update Booking unsuccessful:", error)
      return null
    
    } finally {
      setLoading(false)
    }
  }

  return { updateBooking, loading, error, data }
}