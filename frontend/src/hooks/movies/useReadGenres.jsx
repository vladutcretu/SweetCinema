// React, dependencies & packages
import { useEffect, useState } from "react"

// App
import { useAuthContext } from "@/contexts/AuthContext"
import { genreService } from "@/services/movies/genreService"

// Components here


export const useReadGenres = () => {
  const { accessToken } = useAuthContext()
  const [genres, setGenres] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const getGenres = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await genreService.getGenres()
      setGenres(response.data)
      console.log("Get Genres successful:", response.data)
    } catch (error) {
      setError('Genres cannot be loaded. Please try again!')
      console.error('Get Genres unsuccessful:', error)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    getGenres()
  }, [accessToken])

  return { genres, loading, error, refetch: getGenres }
}