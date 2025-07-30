// React, dependencies & packages
import { useState } from "react"

// App
import { movieService } from "@/services/movies/movieService"

// Components here


export const useUpdateMovie = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const updateMovie = async (
    movieId, 
    title, 
    description, 
    genres,
    poster,
    director,
    cast,
    release,
    durationHours,
    durationMinutes,
    parental_guide,
    language 
  ) => {
    setLoading(true)
    setError(null)
    try {
      const response = await movieService.updateMovie(
        movieId, 
        title, 
        description, 
        genres,
        poster,
        director,
        cast,
        release,
        durationHours,
        durationMinutes,
        parental_guide,
        language 
      )
      setData(response.data)
      alert(`✅ Movie ${title} updated!`)
      console.log("Staf - Update Movie successful:", response.data)
      return response.data
    } catch (error) {
      setError("Something went wrong while updating movie. Please try again.")
      alert(`❌ Movie ${title} not updated!`)
      console.error("Staff - Update Movie unsuccessful:", error)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { updateMovie, loading, error, data }
}