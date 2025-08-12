// React, dependencies & packages
import { useEffect, useState } from "react"

// App
import { showtimeService } from "@/services/showtimes/showtimeService"

// Components here


export const useReadShowtimesByCityMovie = (cityId, movieId) => {
  const [showtimes, setShowtimes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const readShowtimesByCityMovie = async (cityId, movieId) => {
    setLoading(true)
    setError(null)

    try {
      const response = await showtimeService.readShowtimesByCityMovie(cityId, movieId)
      setShowtimes(response.data)
      console.log("User - Read Showtimes by City and Movie successful:", response.data)
    
    } catch (error) {
      if (error.response?.data) {
        const backendErrors = error.response.data
        const errorMessages = Object.values(backendErrors).flat().join("\n")
        setError(`Showtimes for City and Movie cannot be loaded: ${errorMessages}`)
      } else {
        setError("Showtimes for City and Movie cannot be loaded. Please try again.")
      }
      console.error("User - Read Showtimes by City and Movie unsuccessful:", error)
    
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    readShowtimesByCityMovie(cityId, movieId)
  }, [cityId, movieId])

  return { 
    showtimes, 
    loading, 
    error 
  }
}