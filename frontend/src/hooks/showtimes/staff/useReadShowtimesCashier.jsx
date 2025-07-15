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
    try {
      setLoading(true)
      setError(null)
      const response = await showtimeService.readShowtimesCashier(userCity)
      setShowtimes(response.data)
      console.log("Read Showtimes Cashier successful:", response.data)
    } catch (error) {
      setError('Showtimes for Cashier cannot be loaded. Please try again!')
      console.error('Read Showtimes Cashier unsuccessful:', error)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    readShowtimesCashier(userCity)
  }, [accessToken, userCity])

  return { showtimes, loading, error }
}