// React, dependencies & packages
import { useState } from "react"

// App
import { cityService } from "@/services/locations/cityService"

// Components here


export const useUpdateCity = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const updateCity = async (cityId, name, address) => {
    setLoading(true)
    setError(null)

    try {
      const response = await cityService.updateCity(cityId, name, address)
      setData(response.data)
      alert(`✅ City updated!`)
      console.log("Staff - Update City successful:", response.data)
      return response.data
      
    } catch (error) {
      if (error.response?.data) {
        const backendErrors = error.response.data
        const errorMessages = Object.values(backendErrors).flat().join("\n")
        setError(`Something went wrong while updating city: ${errorMessages}`)
        alert(`❌ City not updated!\n${errorMessages}`)
      } else {
        setError("Something went wrong while updating city. Please try again.")
        alert(`❌ City not updated!`)
      }
      console.error("Staff - Update City unsuccessful:", error)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { 
    updateCity, 
    loading, 
    error, 
    data 
  }
}