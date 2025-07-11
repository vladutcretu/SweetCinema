// React, dependencies & packages
import { useEffect, useState } from "react"

// App
import { movieService } from "@/services/movies/movieService"

// Components here


export const useGetMovies = () => {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const getMovies = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await movieService.getMovies()
      setMovies(response.data)
      console.log("Get Movies successful:", response.data)
    } catch (error) {
      setError('Movies cannot be loaded. Please try again!')
      console.error('Get Movies unsuccessful:', error)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    getMovies()
  }, [])

  return { movies, loading, error }
}