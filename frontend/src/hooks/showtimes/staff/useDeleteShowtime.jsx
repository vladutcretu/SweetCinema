// React, dependencies & packages
import { useState } from "react"

// App
import { showtimeService } from "@/services/showtimes/showtimeService"

// Components here


export const useDeleteShowtime = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const deleteShowtime = async (showtimeId) => {
    setLoading(true)
    setError(null)

    try {
      const response = await showtimeService.deleteShowtime(showtimeId)
      setData(response.data)
      alert(`✅ Showtime deleted!`)
      console.log("Staff - Delete Showtime successful:", response.data)
      return true

    } catch (error) {
      if (error.response?.data) {
        const backendErrors = error.response.data
        const errorMessages = Object.values(backendErrors).flat().join("\n")
        setError(`Something went wrong while deleting showtime: ${errorMessages}`)
        alert(`❌ Showtime not deleted!\n${errorMessages}`)
      } else {
        setError("Something went wrong while deleting showtime. Please try again.")
        alert(`❌ Showtime not deleted!`)
      }
      console.error("Staff - Delete Showtime unsuccessful:", error)
      return false

    } finally {
      setLoading(false)
    }
  }

  return { 
    deleteShowtime, 
    loading, 
    error, 
    data 
  }
}