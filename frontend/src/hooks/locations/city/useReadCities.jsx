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

    try {
      setLoading(true)
      setError(null)
      const response = await cityService.readCities()
      setCities(response.data)
      setHasFetched(true)
      console.log("User - Read Cities successful:", response.data)
    } catch (error) {
      setError("Cities cannot be loaded. Please try again!")
      console.log("User - Get Cities unsuccessful:", error)
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