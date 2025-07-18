// React, dependencies & packages
import { useEffect, useState } from "react"

// App
import { movieService } from "@/services/movies/movieService"

// Components here


export const useReadUserMovies = (cityId) => {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const readUserMovies = async (cityId) => {
    try {
      setLoading(true)
      setError(null)
      const response = await movieService.readUserMovies(cityId)
      setMovies(response.data)
      console.log("Read User Movies successful:", response.data)
    } catch (error) {
      setError('Movies cannot be loaded. Please try again!')
      console.error('Read User Movies unsuccessful:', error)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    readUserMovies(cityId)
  }, [cityId])

  return { movies, loading, error }
}