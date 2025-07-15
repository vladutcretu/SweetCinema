// React, dependencies & packages
import { useState } from "react"

// App
import { movieService } from "@/services/movies/movieService"

// Components here


export const useUpdateMovie = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const updateMovie = async (movieId, title, description, genres) => {
    setLoading(true)
    setError(null)
    try {
      const response = await movieService.updateMovie(movieId, title, description, genres)
      setData(response.data)
      alert(`✅ Movie updated!`)
      console.log("Update Movie successful:", response.data)
      return response.data
    } catch (error) {
      setError("Something went wrong while updating movie. Please try again.")
      alert(`❌ Movie name do not updated!`)
      console.error("Update Movie unsuccessful:", error)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { updateMovie, loading, error, data }
}