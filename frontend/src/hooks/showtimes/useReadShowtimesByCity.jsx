// React, dependencies & packages
import { useEffect, useState } from "react"

// App
import { showtimeService } from "@/services/showtimes/showtimeService"

// Components here


export const useReadShowtimesByCity = (cityId) => {
  const [showtimes, setShowtimes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const readShowtimesByCity = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await showtimeService.readShowtimesByCity(cityId)
      setShowtimes(response.data)
      console.log("User - Read Showtimes by City successful:", response.data)

    } catch (error) {
      if (error.response?.data) {
        const backendErrors = error.response.data
        const errorMessages = Object.values(backendErrors).flat().join("\n")
        setError(`Showtimes for City cannot be loaded: ${errorMessages}`)
      } else {
        setError("Showtimes for City cannot be loaded. Please try again.")
      }
      console.error("User - Read Showtimes by City unsuccessful:", error)

    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    readShowtimesByCity()
  }, [cityId])

  return { 
    showtimes, 
    loading, 
    error 
  }
}