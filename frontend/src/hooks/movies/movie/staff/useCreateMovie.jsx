// React, dependencies & packages
import { useState } from "react"

// App
import { movieService } from "@/services/movies/movieService"

// Components here


export const useCreateMovie = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const createMovie = async (
        title, 
        description, 
        genres,
        poster,
        director,
        cast,
        release,
        duration,
        parental_guide,
        language
  ) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await movieService.createMovie(
        title, 
        description, 
        genres,
        poster,
        director,
        cast,
        release,
        duration,
        parental_guide,
        language
      )
      setData(response.data)
      alert(`✅ Movie ${title} created!`)
      console.log("Staff - Create Movie successful:", response.data)
      return response.data

    } catch (error) {
      if (error.response?.data) {
        const backendErrors = error.response.data
        const errorMessages = Object.values(backendErrors).flat().join("\n")
        setError(`Something went wrong while creating movie: ${errorMessages}`)
        alert(`❌ Movie ${title} not created!\n${errorMessages}`)
      } else {
        setError("Something went wrong while creating movie. Please try again.")
        alert(`❌ Movie ${title}} not created!`)
      }
      console.error("Staff - Create Movie unsuccessful:", error)
      return null

    } finally {
      setLoading(false)
    }
  }

  return { 
    createMovie, 
    loading, 
    error, 
    data 
  }
}