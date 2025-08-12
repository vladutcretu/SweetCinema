// React, dependencies & packages
import { useState } from "react"

// App
import { theaterService } from "@/services/locations/theaterService"

// Components here


export const useDeleteTheater = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const deleteTheater = async (theaterId) => {
    setLoading(true)
    setError(null)

    try {
      const response = await theaterService.deleteTheater(theaterId)
      setData(response.data)
      alert(`✅ Theater deleted!`)
      console.log("Staff - Delete Theater successful:", response.data)
      return true

    } catch (error) {
      if (error.response?.data) {
        const backendErrors = error.response.data
        const errorMessages = Object.values(backendErrors).flat().join("\n")
        setError(`Something went wrong while deleting theater: ${errorMessages}`)
        alert(`❌ Theater not deleted!\n${errorMessages}`)
      } else {
        setError("Something went wrong while deleting theater. Please try again.")
        alert(`❌ Theater not deleted!`)
      }
      console.error("Staff - Delete Theater unsuccessful:", error)
      return false

    } finally {
      setLoading(false)
    }
  }

  return { 
    deleteTheater, 
    loading, 
    error, 
    data 
  }
}