// React, dependencies & packages
import { useState } from "react"

// App
import { userService } from "@/services/users/userService"

// Components here


export const useUpdateUser = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const updateUser = async (userId, fieldsToUpdate) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await userService.updateUser(userId, fieldsToUpdate)
      setData(response.data)
      alert(`✅ User updated!`)
      console.log("Staff / User - Update user successful:", response.data)
      return response.data
    
    } catch (error) {
      if (error.response?.data) {
        const backendErrors = error.response.data
        const errorMessages = Object.values(backendErrors).flat().join("\n")
        setError(`Something went wrong while updating user: ${errorMessages}`)
        alert(`❌ User not updated!\n${errorMessages}`)
      } else {
        setError("Something went wrong while updating user. Please try again.")
        alert(`❌ User not updated!`)
      }
      console.error("Staff / User - Update user unsuccessful:", error)
      return null
    
    } finally {
      setLoading(false)
    }
  }

  return { 
    updateUser, 
    loading, 
    error, 
    data 
  }
}