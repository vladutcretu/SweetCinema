// React, dependencies & packages
import { useState } from "react"

// App
import { movieService } from "@/services/movies/movieService"

// Components here


export const useCreateMovie = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const createMovie = async (title, description, genres) => {
    setLoading(true)
    setError(null)
    try {
      const response = await movieService.createMovie(title, description, genres)
      setData(response.data)
      alert(`✅ Movie ${title} created!`)
      console.log("Create Movie successful:", response.data)
      return response.data
    } catch (error) {
      setError("Something went wrong while creating movie. Please try again.")
      alert(`❌ Movie ${title} do not created!`)
      console.error("Create Movie unsuccessful:", error)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { createMovie, loading, error, data }
}