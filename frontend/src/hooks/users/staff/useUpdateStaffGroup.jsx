// React, dependencies & packages
import { useState } from "react"

// App
import { userService } from "@/services/users/userService"

// Components here


export const useUpdateStaffGroup = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const updateStaffGroup = async (userId, action) => {
    setLoading(true)
    setError(null)
    try {
      const response = await userService.updateStaffGroup(userId, action)
      setData(response.data)
      alert(`✅ Staff group updated to ${action}!`)
      console.log("Update Staff member Group successful:", response.data)
      return response.data
    } catch (error) {
      setError("Something went wrong while updating Staff member group. Please try again.")
      alert(`❌ Staff member group do not updated!`)
      console.error("Update User member Group unsuccessful:", error)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { updateStaffGroup, loading, error, data }
}