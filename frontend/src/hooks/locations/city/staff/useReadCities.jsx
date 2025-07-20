// React, dependencies & packages
import { useEffect, useState } from "react"

// App
import { useAuthContext } from "@/contexts/AuthContext"
import { cityService } from "@/services/locations/cityService"

// Components here


export const useReadCities = () => {
  const { accessToken } = useAuthContext()
  const [cities, setCities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const readCities = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await cityService.readCities()
      setCities(response.data)
      console.log("Staff - Read Cities successful:", response.data)
    } catch (error) {
      setError('Something went wrong while reading cities. Please try again.')
      console.error('Staff - Read Cities unsuccessful:', error)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    readCities()
  }, [accessToken])

  return { cities, loading, error, refetch: readCities }
}