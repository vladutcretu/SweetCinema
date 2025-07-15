// React, dependencies & packages
import { useEffect, useState } from "react"

// App
import { movieService } from "@/services/movies/movieService"

// Components here


export const useGetMovie = (id) => {
  const [movie, setMovie] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const getMovie = async (id) => {
    try {
      setLoading(true)
      setError(null)
      const response = await movieService.getMovie(id)
      setMovie(response.data)
      console.log("Get Movie successful:", response.data)
    } catch (error) {
      setError('Movie cannot be loaded. Please try again!')
      console.error('Get Movie unsuccessful:', error)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    getMovie(id)
  }, [])

  return { movie, loading, error }
}