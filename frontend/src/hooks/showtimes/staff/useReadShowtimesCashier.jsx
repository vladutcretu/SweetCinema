// React, dependencies & packages
import { useEffect, useState } from "react"

// App
import { useAuthContext } from "@/contexts/AuthContext"
import { showtimeService } from "@/services/showtimes/showtimeService"

// Components here


export const useReadShowtimesCashier = (userCity) => {
  const { accessToken } = useAuthContext()
  const [showtimes, setShowtimes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const readShowtimesCashier = async (userCity) => {
    setLoading(true)
    setError(null)

    try {
      const response = await showtimeService.readShowtimesCashier(userCity)
      setShowtimes(response.data)
      console.log("Staff - Read Showtimes for Cashier successful:", response.data)

    } catch (error) {
      if (error.response?.data) {
        const backendErrors = error.response.data
        const errorMessages = Object.values(backendErrors).flat().join("\n")
        setError(`Showtimes for Cashier cannot be loaded: ${errorMessages}`)
      } else {
        setError("Showtimes for Cashier cannot be loaded. Please try again.")
      }
      console.error('Staff - Read Showtimes for Cashier unsuccessful:', error)

    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    readShowtimesCashier(userCity)
  }, [accessToken, userCity])

  return { 
    showtimes, 
    loading, 
    error 
  }
}