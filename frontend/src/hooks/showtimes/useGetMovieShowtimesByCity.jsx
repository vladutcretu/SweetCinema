// React, dependencies & packages
import { useEffect, useState } from "react"

// App
import { showtimeService } from "@/services/showtimes/showtimeService"

// Components here


export const useGetMovieShowtimesByCity = (movieId, cityId) => {
  const [showtimes, setShowtimes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const getMovieShowtimesByCity = async (movieId, cityId) => {
    try {
      setLoading(true)
      setError(null)
      const response = await showtimeService.getMovieShowtimesByCity(movieId, cityId)
      setShowtimes(response.data)
      console.log("Get Movie Showtimes by City successful:", response.data)
    } catch (error) {
      setError('Movie Showtimes for City cannot be loaded. Please try again!')
      console.error('Get Movie Showtimes by City unsuccessful:', error)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    getMovieShowtimesByCity(movieId, cityId)
  }, [])

  return { showtimes, loading, error }
}