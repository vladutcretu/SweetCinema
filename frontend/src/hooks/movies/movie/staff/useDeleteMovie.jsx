// React, dependencies & packages
import { useState } from "react"

// App
import { movieService } from "@/services/movies/movieService"

// Components here


export const useDeleteMovie = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const deleteMovie = async (movieId) => {
    setLoading(true)
    setError(null)
    try {
      const response = await movieService.deleteMovie(movieId)
      setData(response.data)
      alert(`✅ Movie deleted!`)
      console.log("Delete Movie successful:", response.data)
      return true
    } catch (error) {
      setError("Something went wrong while deleting movie. Please try again.")
      alert(`❌ Movie do not deleted!`)
      console.error("Delete Movie unsuccessful:", error)
      return false
    } finally {
      setLoading(false)
    }
  }

  return { deleteMovie, loading, error, data }
}