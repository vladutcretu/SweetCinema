// React, dependencies & packages
import { useState } from "react"

// App
import { theaterService } from "@/services/locations/theaterService"

// Components here


export const useCreateTheater = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const createTheater = async (name, city, rows, columns) => {
    setLoading(true)
    setError(null)
    try {
      const response = await theaterService.createTheater(name, city, rows, columns)
      setData(response.data)
      alert(`✅ Theater ${name} created!`)
      console.log("Create Theater successful:", response.data)
      return response.data
    } catch (error) {
      setError("Something went wrong while creating theater. Please try again.")
      alert(`❌ Theater ${name} do not created!`)
      console.error("Create Theater unsuccessful:", error)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { createTheater, loading, error, data }
}