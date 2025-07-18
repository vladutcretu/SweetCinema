// React, dependencies & packages
import { useEffect, useState } from "react"

// App
import { showtimeService } from "@/services/showtimes/showtimeService"

// Components here


export const useGetShowtime = (showtimeId) => {
  const [showtime, setShowtime] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const getShowtime = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await showtimeService.getShowtime(showtimeId)
      setShowtime(response.data)
      console.log("Get Showtime successful:", response.data)
    } catch (error) {
      setError('Showtime cannot be loaded. Please try again!')
      console.error('Get Showtime unsuccessful:', error)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    getShowtime(showtimeId)
  }, [showtimeId])

  return { showtime, loading, error }
}