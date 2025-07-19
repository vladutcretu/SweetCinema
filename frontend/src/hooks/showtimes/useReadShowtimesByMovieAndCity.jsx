// React, dependencies & packages
import { useEffect, useState } from "react"

// App
import { showtimeService } from "@/services/showtimes/showtimeService"

// Components here


export const useReadShowtimesByMovieAndCity = (movieId, cityId) => {
  const [showtimes, setShowtimes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const readShowtimesByMovieAndCity = async (movieId, cityId) => {
    try {
      setLoading(true)
      setError(null)
      const response = await showtimeService.readShowtimesByMovieAndCity(movieId, cityId)
      setShowtimes(response.data)
      console.log("Read Showtimes by Movie and City successful:", response.data)
    } catch (error) {
      setError('Movie Showtimes for City cannot be loaded. Please try again!')
      console.error('Read Showtimes by Movie and City unsuccessful:', error)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    readShowtimesByMovieAndCity(movieId, cityId)
  }, [movieId, cityId])

  return { showtimes, loading, error }
}