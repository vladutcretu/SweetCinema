// React, dependencies & packages
import { useEffect, useState } from "react"

// App
import { showtimeService } from "@/services/showtimes/showtimeService"

// Components here


export const useGetShowtimeSeats = (showtimeId) => {
  const [showtimeSeats, setShowtimeSeats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const getShowtimeSeats = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await showtimeService.getShowtimeSeats(showtimeId)
      setShowtimeSeats(response.data)
      console.log("Get Showtime Seats successful:", response.data)
    } catch (error) {
      setError('Showtime Seats cannot be loaded. Please try again!')
      console.error('Get Showtime Seats unsuccessful:', error)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    getShowtimeSeats(showtimeId)
  }, [showtimeId])

  return { showtimeSeats, loading, error, refetch: getShowtimeSeats }
}