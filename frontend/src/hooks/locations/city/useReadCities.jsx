// React, dependencies & packages
import { useEffect, useState } from "react"

// App
import { cityService } from "@/services/locations/cityService"

// Components here


export const useReadCities = (shouldFetch = false) => {
  const [cities, setCities] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasFetched, setHasFetched] = useState(false)

  const readCities = async () => {
    if (hasFetched) return 
    setLoading(true)
    setError(null)

    try {
      const response = await cityService.readCities()
      setCities(response.data)
      setHasFetched(true)
      console.log("User - Read Cities successful:", response.data)

    } catch (error) {
      if (error.response?.data) {
        const backendErrors = error.response.data
        const errorMessages = Object.values(backendErrors).flat().join("\n")
        setError(`Cities cannot be loaded: ${errorMessages}`)
      } else {
        setError("Cities cannot be loaded. Please try again.")
      }
      console.log("User - Read Cities unsuccessful:", error)
    
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (shouldFetch) readCities()
  }, [shouldFetch])

  return { 
    cities, 
    loading, 
    error, 
    fetchCities: () => { if (!hasFetched) readCities() }
  }
}