// React, dependencies & packages
import { useState } from "react"

// App
import { paymentService } from "@/services/tickets/paymentService"

// Components here


export const useCreatePayment = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const createPayment = async (bookingIds, paymentAmount, paymentMethod) => {
    setLoading(true)
    setError(null)

    try {
      const response = await paymentService.createPayment(bookingIds, paymentAmount, paymentMethod)
      setData(response.data)
      console.log("User - Create Payment successful:", response.data)
      return response.data
    
    } catch (error) {
      if (error.response?.data) {
        const backendErrors = error.response.data
        const errorMessages = Object.values(backendErrors).flat().join("\n")
        setError(`Something went wrong while creating payment: ${errorMessages}`)
        alert(`❌ Payment not created!\n${errorMessages}`)
      } else {
        setError("Something went wrong while creating payment. Please try again.")
        alert(`❌ Payment not created!`)
      }
      console.error("User - Create Payment unsuccessful:", error)
      return null
    
    } finally {
      setLoading(false)
    }
  }

  return { 
    createPayment, 
    loading, 
    error, 
    data 
  }
}