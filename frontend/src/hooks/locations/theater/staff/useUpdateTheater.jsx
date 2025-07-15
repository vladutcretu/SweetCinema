// React, dependencies & packages
import { useState } from "react"

// App
import { theaterService } from "@/services/locations/theaterService"

// Components here


export const useUpdateTheater = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const updateTheater = async (theaterId, name, rows, columns) => {
    setLoading(true)
    setError(null)
    try {
      const response = await theaterService.updateTheater(theaterId, name, rows, columns)
      setData(response.data)
      alert(`✅ Theater updated!`)
      console.log("Update Theater successful:", response.data)
      return response.data
    } catch (error) {
      setError("Something went wrong while updating theater. Please try again.")
      alert(`❌ Theater ${name} do not updated!`)
      console.error("Update Theater unsuccessful:", error)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { updateTheater, loading, error, data }
}