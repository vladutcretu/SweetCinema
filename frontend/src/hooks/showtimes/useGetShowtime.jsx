// React, dependencies & packages
import { useEffect, useState } from "react"

// App
import { showtimeService } from "@/services/showtimes/showtimeService"

// Components here


export const useGetShowtime = (id) => {
  const [showtime, setShowtime] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const getShowtime = async (id) => {
    try {
      setLoading(true)
      setError(null)
      const response = await showtimeService.getShowtime(id)
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
    getShowtime(id)
  }, [])

  return { showtime, loading, error }
}