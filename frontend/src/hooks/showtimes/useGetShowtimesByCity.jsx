// React, dependencies & packages
import { useEffect, useState } from "react"

// App
import { showtimeService } from "@/services/showtimes/showtimeService"

// Components here


export const useGetShowtimesByCity = (cityId) => {
  const [showtimes, setShowtimes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const getShowtimesByCity = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await showtimeService.getShowtimesByCity(cityId)
      setShowtimes(response.data)
      console.log("Get Showtimes by City successful:", response.data)
    } catch (error) {
      setError('Showtimes for City cannot be loaded. Please try again!')
      console.error('Get Showtimes by City unsuccessful:', error)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    getShowtimesByCity()
  }, [cityId])

  return { showtimes, loading, error }
}