// React, dependencies & packages
import { useEffect, useState } from "react"

// App
import { useAuthContext } from "@/contexts/AuthContext"
import { showtimeService } from "@/services/showtimes/showtimeService"

// Components here

export const useReadShowtimeReport = (showtimeId) => {
  const { accessToken } = useAuthContext()
  const [showtimeReport, setShowtimeReport] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!showtimeId) return
    const readShowtimeReport = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await showtimeService.readShowtimeReport(showtimeId)
        setShowtimeReport(response.data)
        console.log("Staff - Read Showtime Report successful:", response.data)
      } catch (error) {
        setError("Showtime Report cannot be loaded. Please try again!")
        console.error("Staff - Read Showtime Report unsuccessful:", error)
      } finally {
        setLoading(false)
      }
    }

    readShowtimeReport()
  }, [accessToken, showtimeId])

  return { showtimeReport, loading, error }
}