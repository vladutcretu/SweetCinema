// React, dependencies & packages
import { useState } from "react"

// App
import { genreService } from "@/services/movies/genreService"

// Components here


export const useUpdateGenre = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const updateGenre = async (genreId, name) => {
    setLoading(true)
    setError(null)
    try {
      const response = await genreService.updateGenre(genreId, name)
      setData(response.data)
      alert(`✅ Genre name updated to ${name}!`)
      console.log("Staff - Update Genre successful:", response.data)
      return response.data
    } catch (error) {
      setError("Something went wrong while updating genre. Please try again.")
      alert(`❌ Genre name not updated!`)
      console.error("Staff - Update Genre unsuccessful:", error)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { updateGenre, loading, error, data }
}