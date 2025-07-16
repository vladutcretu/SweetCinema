// React, dependencies & packages
import { theaterService } from "@/services/locations/theaterService"
import { useEffect, useState } from "react"

// App


// Components here


export const useReadTheaters = () => {
  const [theaters, setTheaters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const readTheaters = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await theaterService.readTheaters()
      setTheaters(response.data)
      console.log("Read Theaters successful:", response.data)
    } catch (error) {
      setError("Theaters cannot be loaded. Please try again!")
      console.error('Read Theaters unsuccessful:', error)
    } finally {
      setLoading(false)
    }
  }
    
  useEffect(() => {
    readTheaters()
  }, [])

  return { theaters, loading, error, refetch: readTheaters }
}