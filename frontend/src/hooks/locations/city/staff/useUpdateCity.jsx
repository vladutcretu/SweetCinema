// React, dependencies & packages
import { useState } from "react"

// App
import { cityService } from "@/services/locations/cityService"

// Components here


export const useUpdateCity = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const updateCity = async (cityId, name) => {
    setLoading(true)
    setError(null)
    try {
      const response = await cityService.updateCity(cityId, name)
      setData(response.data)
      alert(`✅ City name updated to ${name}!`)
      console.log("Update City successful:", response.data)
      return response.data
    } catch (error) {
      setError("Something went wrong while updating city. Please try again.")
      alert(`❌ City name do not updated!`)
      console.error("Update City unsuccessful:", error)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { updateCity, loading, error, data }
}