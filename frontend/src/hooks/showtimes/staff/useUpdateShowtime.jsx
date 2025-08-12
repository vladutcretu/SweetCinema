// React, dependencies & packages
import { useState } from "react"

// App
import { showtimeService } from "@/services/showtimes/showtimeService"

// Components here


export const useUpdateShowtime = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const updateShowtime = async (
    showtimeId, 
    price, 
    starts_at, 
    format, 
    presentation
  ) => {
    setLoading(true)
    setError(null)

    try {
      const response = await showtimeService.updateShowtime(
        showtimeId, 
        price, 
        starts_at,
        format,
        presentation
      )
      setData(response.data)
      alert(`✅ Showtime updated!`)
      console.log("Staff - Update Showtime successful:", response.data)
      return response.data

    } catch (error) {
      if (error.response?.data) {
        const backendErrors = error.response.data
        const errorMessages = Object.values(backendErrors).flat().join("\n")
        setError(`Something went wrong while updating showtime: ${errorMessages}`)
        alert(`❌ Showtime not updated!\n${errorMessages}`)
      } else {
        setError("Something went wrong while updating showtime. Please try again.")
        alert(`❌ Showtime not updated!`)
      }
      console.error("Staff - Update Showtime unsuccessful:", error)
      return null

    } finally {
      setLoading(false)
    }
  }

  return { 
    updateShowtime, 
    loading, 
    error, 
    data 
  }
}