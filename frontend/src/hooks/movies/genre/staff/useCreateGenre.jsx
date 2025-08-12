// React, dependencies & packages
import { useState } from "react"

// App
import { genreService } from "@/services/movies/genreService"

// Components here


export const useCreateGenre = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const createGenre = async (name) => {
    setLoading(true)
    setError(null)

    try {
      const response = await genreService.createGenre(name)
      setData(response.data)
      alert(`✅ Genre ${name} created!`)
      console.log("Staff - Create Genre successful:", response.data)
      return response.data

    } catch (error) {
      if (error.response?.data) {
        const backendErrors = error.response.data
        const errorMessages = Object.values(backendErrors).flat().join("\n")
        setError(`Something went wrong while creating genre: ${errorMessages}`)
        alert(`❌ Genre ${name} not created!\n${errorMessages}`)
      } else {
        setError("Something went wrong while creating genre. Please try again.")
        alert(`❌ Genre ${name} not created!`)
      }
      console.error("Staff - Create Genre unsuccessful:", error)
      return null

    } finally {
      setLoading(false)
    }
  }

  return { 
    createGenre, 
    loading, 
    error, 
    data
  }
}