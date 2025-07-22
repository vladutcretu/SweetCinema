// React, dependencies & packages
import { useState } from "react"

// App
import { showtimeService } from "@/services/showtimes/showtimeService"

// Components here


export const useCreateShowtime = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const createShowtime = async (
    movie, 
    theater, 
    price, 
    starts_at, 
    format, 
    presentation
  ) => {
    setLoading(true)
    setError(null)
    try {
      const response = await showtimeService.createShowtime(
        movie, 
        theater, 
        price, 
        starts_at, 
        format, 
        presentation
      )
      setData(response.data)
      alert(`✅ Showtime created!`)
      console.log("Staff - Create Showtime successful:", response.data)
      return response.data
    } catch (error) {
      setError("Something went wrong while creating showtime. Please try again.")
      alert(`❌ Showtime not created!`)
      console.error("Staff - Create Showtime unsuccessful:", error)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { createShowtime, loading, error, data }
}