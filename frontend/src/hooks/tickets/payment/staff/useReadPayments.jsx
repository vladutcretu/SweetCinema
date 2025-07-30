// React, dependencies & packages
import { useEffect, useState } from "react"

// App
import { useAuthContext } from "@/contexts/AuthContext"
import { paymentService } from "@/services/tickets/paymentService"

// Components here


export const useReadPayments = () => {
  const { accessToken } = useAuthContext()
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const readPayments = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await paymentService.readPayments()
      setPayments(response.data)
      console.log("Staff - Read Payments successful:", response.data)
    } catch (error) {
      setError('Payments cannot be loaded. Please try again!')
      console.error('Staff - Read Payments unsuccessful:', error)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    readPayments()
  }, [accessToken])

  return { payments, loading, error }
}