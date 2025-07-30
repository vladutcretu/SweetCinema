// React, dependencies & packages
import { useState } from "react"

// App
import { cityService } from "@/services/locations/cityService"

// Components here


export const useCreateCity = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const createCity = async (name, address) => {
    setLoading(true)
    setError(null)
    try {
      const response = await cityService.createCity(name, address)
      setData(response.data)
      alert(`✅ City ${name} created!`)
      console.log("Staff - Create City successful:", response.data)
      return response.data
    } catch (error) {
      setError("Something went wrong while creating city. Please try again.")
      alert(`❌ City ${name} not created!`)
      console.error("Staff - Create City unsuccessful:", error)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { createCity, loading, error, data }
}