// React, dependencies & packages
import { useEffect, useState } from "react"

// App
import { showtimeService } from "@/services/showtimes/showtimeService"

// Components here


export const useReadShowtimeSeats = (showtimeId) => {
  const [showtimeSeats, setShowtimeSeats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const readShowtimeSeats = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await showtimeService.readShowtimeSeats(showtimeId)
      setShowtimeSeats(response.data)
      console.log("User - Read Showtime Seats successful:", response.data)
    } catch (error) {
      setError('Showtime Seats cannot be loaded. Please try again!')
      console.error('User - Read Showtime Seats unsuccessful:', error)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    readShowtimeSeats(showtimeId)
  }, [showtimeId])

  return { showtimeSeats, loading, error, refetch: readShowtimeSeats }
}