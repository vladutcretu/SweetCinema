// React, dependencies & packages
import { useEffect, useState } from "react"

// App
import { useAuthContext } from "@/contexts/AuthContext"
import { theaterService } from "@/services/locations/theaterService"

// Components here


export const useReadTheaters = () => {
  const { accessToken } = useAuthContext()
  const [theaters, setTheaters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const readTheaters = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await theaterService.readTheaters()
      setTheaters(response.data)
      console.log("Staff - Read Theaters successful:", response.data)
    } catch (error) {
      setError("Something went wrong while reading theaters. Please try again.")
      console.error('Staff - Read Theaters unsuccessful:', error)
    } finally {
      setLoading(false)
    }
  }
    
  useEffect(() => {
    readTheaters()
  }, [accessToken])

  return { theaters, loading, error, refetch: readTheaters }
}