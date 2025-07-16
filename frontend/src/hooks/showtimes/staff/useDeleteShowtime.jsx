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
      console.log("Delete Showtime successful:", response.data)
      return true
    } catch (error) {
      setError("Something went wrong while deleting showtime. Please try again.")
      alert(`❌ Showtime do not deleted!`)
      console.error("Delete Showtime unsuccessful:", error)
      return false
    } finally {
      setLoading(false)
    }
  }

  return { deleteShowtime, loading, error, data }
}