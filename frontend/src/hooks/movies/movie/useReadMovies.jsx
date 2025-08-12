// React, dependencies & packages
import { useEffect, useState } from "react"

// App
import { movieService } from "@/services/movies/movieService"

// Components here


export const useReadMovies = (cityId) => {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const readMovies = async (cityId) => {
    setLoading(true)
    setError(null)

    try {
      const response = await movieService.readMovies(cityId)
      setMovies(response.data)
      console.log("User - Read Movies successful:", response.data)

    } catch (error) {
      if (error.response?.data) {
        const backendErrors = error.response.data
        const errorMessages = Object.values(backendErrors).flat().join("\n")
        setError(`Movies cannot be loaded: ${errorMessages}`)
      } else {
        setError("Movies cannot be loaded. Please try again.")
      }
      console.error('User - Read Movies unsuccessful:', error)

    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    readMovies(cityId)
  }, [cityId])

  return { 
    movies, 
    loading, 
    error 
  }
}