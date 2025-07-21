// React, dependencies & packages
import { useEffect, useState } from "react"

// App
import { movieService } from "@/services/movies/movieService"

// Components here


export const useReadMovie = (movieId) => {
  const [movie, setMovie] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const getMovie = async (movieId) => {
    try {
      setLoading(true)
      setError(null)
      const response = await movieService.readMovie(movieId)
      setMovie(response.data)
      console.log("User - Read Movie successful:", response.data)
    } catch (error) {
      setError('Movie cannot be loaded. Please try again!')
      console.error('User - Read Movie unsuccessful:', error)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    getMovie(movieId)
  }, [movieId])

  return { movie, loading, error }
}