// React, dependencies & packages
import { useState } from "react"

// App
import { ticketService } from "@/services/tickets/ticketService"

// Components here


export const usePostPaymentComplete = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const postPaymentComplete = async (bookingIds, paymentAmount, paymentMethod) => {
    setLoading(true)
    setError(null)
    setData(null)
    try {
      const response = await ticketService.postPaymentComplete(bookingIds, paymentAmount, paymentMethod)
      setData(response.data)
      console.log("Post Payment Complete successful:", response.data)
      return response.data
    } catch (error) {
      setError("Something went wrong while completing the payment. Please try again.")
      console.error("Post Payment Complete unsuccessful:", error)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { postPaymentComplete, loading, error, data }
}