// React, dependencies & packages
import { useEffect, useState } from "react"

// App
import { useAuthContext } from "@/contexts/AuthContext"
import { showtimeService } from "@/services/showtimes/showtimeService"

// Components here


export const useReadShowtimes = () => {
  const { accessToken } = useAuthContext()
  const [showtimes, setShowtimes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const readShowtimes = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await showtimeService.readShowtimes()
      setShowtimes(response.data)
      console.log("Read Showtimes successful:", response.data)
    } catch (error) {
      setError('Showtimes cannot be loaded. Please try again!')
      console.error('Read Showtimes unsuccessful:', error)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    readShowtimes()
  }, [accessToken])

  return { showtimes, loading, error, refetch: readShowtimes }
}