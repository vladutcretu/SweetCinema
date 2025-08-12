// React, dependencies & packages
import { useState } from "react"

// App
import { bookingService } from "@/services/tickets/bookingService"

// Components here


export const useUpdateBookingCashier = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const updateBookingCashier = async (bookingId) => {
    setLoading(true)
    setError(null)

    try {
      const response = await bookingService.updateBookingCashier(bookingId)
      setData(response.data)
      alert(`✅ Booking updated!`)
      console.log("Staff / Cashier - Update Booking successful:", response.data)
      return response.data
    
    } catch (error) {
      if (error.response?.data) {
        const backendErrors = error.response.data
        const errorMessages = Object.values(backendErrors).flat().join("\n")
        setError(`Something went wrong while updating the booking for Cashier: ${errorMessages}`)
        alert(`❌ Booking updated!\n${errorMessages}`)
      } else {
        setError("Something went wrong while updating the booking for Cashier. Please try again.")
        alert(`❌ Booking updated!`)
      }
      console.error("Staff / Cashier - Update Booking unsuccessful:", error)
      return null
    
    } finally {
      setLoading(false)
    }
  }

  return { 
    updateBookingCashier, 
    loading, 
    error, 
    data 
  }
}