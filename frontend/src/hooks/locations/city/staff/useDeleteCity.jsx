// React, dependencies & packages
import { useState } from "react"

// App
import { cityService } from "@/services/locations/cityService"

// Components here


export const useDeleteCity = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const deleteCity = async (cityId) => {
    setLoading(true)
    setError(null)

    try {
      const response = await cityService.deleteCity(cityId)
      setData(response.data)
      alert(`✅ City deleted!`)
      console.log("Staff - Delete City successful:", response.data)
      return true

    } catch (error) {
      if (error.response?.data) {
        const backendErrors = error.response.data
        const errorMessages = Object.values(backendErrors).flat().join("\n")
        setError(`Something went wrong while deleting city: ${errorMessages}`)
        alert(`❌ City not deleted!\n${errorMessages}`)
      } else {
        setError("Something went wrong while deleting city. Please try again.")
        alert(`❌ City not deleted!`)
      }
      console.error("Staff - Delete City unsuccessful:", error)
      return false

    } finally {
      setLoading(false)
    }
  }

  return { 
    deleteCity, 
    loading, 
    error,
     data 
  }
}