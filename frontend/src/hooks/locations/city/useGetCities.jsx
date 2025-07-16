// React, dependencies & packages
import { useEffect, useState } from "react"

// App
import { cityService } from "@/services/locations/cityService"

// Components here


export const useGetCities = () => {
  const [cities, setCities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const getCities = async () => {
      try {
        setLoading(true)
        const response = await cityService.getCities()
        setCities(response.data)
      } catch (error) {
        setError("Cities cannot be loaded. Please try again!")
      } finally {
        setLoading(false)
      }
    }
    
    getCities()
  }, [])

  return { cities, loading, error }
}