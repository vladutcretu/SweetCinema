// React, dependencies & packages
import { useState } from "react"

// App
import { userService } from "@/services/users/userService"

// Components here


export const useUpdateStaffCity = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const updateStaffCity = async (userId, city) => {
    setLoading(true)
    setError(null)
    try {
      const response = await userService.updateStaffCity(userId, city)
      setData(response.data)
      alert(`✅ Staff member city updated to ${city}!`)
      console.log("Update staff member city successful:", response.data)
      return response.data
    } catch (error) {
      setError("Something went wrong while updating staff member city. Please try again.")
      alert(`❌ Staff member city do not updated!`)
      console.error("Update staff member unsuccessful:", error)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { updateStaffCity, loading, error, data }
}