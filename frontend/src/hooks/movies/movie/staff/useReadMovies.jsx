// React, dependencies & packages
import { useEffect, useState } from "react"

// App
import { useAuthContext } from "@/contexts/AuthContext"
import { movieService } from "@/services/movies/movieService"

// Components here


export const useReadMovies = () => {
  const { accessToken } = useAuthContext()
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const readMovies = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await movieService.readMoviesStaff()
      setMovies(response.data)
      console.log("Staff - Read Movies successful:", response.data)
    } catch (error) {
      setError("Something went wrong while reading movies. Please try again.")
      console.error('Staff - Read Movies unsuccessful:', error)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    readMovies()
  }, [accessToken])

  return { movies, loading, error, refetch: readMovies }
}