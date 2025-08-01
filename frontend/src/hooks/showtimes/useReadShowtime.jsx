// React, dependencies & packages
import { useEffect, useState } from "react"

// App
import { showtimeService } from "@/services/showtimes/showtimeService"

// Components here


export const useReadShowtime = (showtimeId) => {
  const [showtime, setShowtime] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const readShowtime = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await showtimeService.readShowtime(showtimeId)
      setShowtime(response.data)
      console.log("User - Read Showtime successful:", response.data)
    } catch (error) {
      setError('Showtime cannot be loaded. Please try again!')
      console.error('User - Read Showtime unsuccessful:', error)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    readShowtime(showtimeId)
  }, [showtimeId])

  return { showtime, loading, error }
}