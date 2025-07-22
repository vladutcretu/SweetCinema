// React, dependencies & packages
import { useEffect, useState } from "react"

// App
import { showtimeService } from "@/services/showtimes/showtimeService"

// Components here


export const useReadShowtimesByCity = (cityId) => {
  const [showtimes, setShowtimes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const readShowtimesByCity = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await showtimeService.readShowtimesByCity(cityId)
      setShowtimes(response.data)
      console.log("User - Read Showtimes by City successful:", response.data)
    } catch (error) {
      setError('Showtimes for City cannot be loaded. Please try again!')
      console.error('User - Read Showtimes by City unsuccessful:', error)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    readShowtimesByCity()
  }, [cityId])

  return { showtimes, loading, error }
}