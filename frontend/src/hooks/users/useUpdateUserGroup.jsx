// React, dependencies & packages
import { useState } from "react"

// App
import { userService } from "@/services/users/userService"

// Components here


export const useUpdateUserGroup = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const updateUserGroup = async (userId, action) => {
    setLoading(true)
    setError(null)
    try {
      const response = await userService.updateUserGroup(userId, action)
      setData(response.data)
      alert(`✅ User group updated to ${action}!`)
      console.log("Update User Group successful:", response.data)
      return response.data
    } catch (error) {
      setError("Something went wrong while updating user group. Please try again.")
      alert(`❌ User group do not updated!`)
      console.error("Update User Group unsuccessful:", error)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { updateUserGroup, loading, error, data }
}