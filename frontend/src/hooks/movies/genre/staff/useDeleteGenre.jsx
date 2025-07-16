// React, dependencies & packages
import { useState } from "react"

// App
import { genreService } from "@/services/movies/genreService"

// Components here


export const useDeleteGenre = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const deleteGenre = async (genreId) => {
    setLoading(true)
    setError(null)
    try {
      const response = await genreService.deleteGenre(genreId)
      setData(response.data)
      alert(`✅ Genre deleted!`)
      console.log("Delete Genre successful:", response.data)
      return true
    } catch (error) {
      setError("Something went wrong while deleting genre. Please try again.")
      alert(`❌ Genre do not deleted!`)
      console.error("Delete Genre unsuccessful:", error)
      return false
    } finally {
      setLoading(false)
    }
  }

  return { deleteGenre, loading, error, data }
}