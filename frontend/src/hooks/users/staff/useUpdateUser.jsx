// React, dependencies & packages
import { useState } from "react"

// App
import { userService } from "@/services/users/userService"
import { Group } from "@chakra-ui/react"

// Components here


export const useUpdateUser = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const updateUser = async (userId, group, city) => {
    setLoading(true)
    setError(null)
    try {
      const response = await userService.updateUser(userId, group, city)
      setData(response.data)
      alert(`✅ User updated!`)
      console.log("Staff - Update user successful:", response.data)
      return response.data
    } catch (error) {
      setError("Something went wrong while updating user. Please try again.")
      alert(`❌ User not updated!`)
      console.error("Staff - Update user unsuccessful:", error)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { updateUser, loading, error, data }
}