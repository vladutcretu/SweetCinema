// React, dependencies & packages
import { useEffect, useState } from "react"

// App
import { useAuthContext } from "@/contexts/AuthContext"
import { userService } from "@/services/users/userService"

// Components here


export const useReadUser = (userId) => {
  const { accessToken, user: authUser } = useAuthContext()
  const [user, setUser] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const readUser = async (userId) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await userService.readUser(userId)
      setUser(response.data)
      console.log("User - Read User successful:", response.data)
      return response.data
    
    } catch (error) {
      if (error.response?.data) {
        const backendErrors = error.response.data
        const errorMessages = Object.values(backendErrors).flat().join("\n")
        setError(`Something went wrong while reading user: ${errorMessages}`)
      } else {
        setError("Something went wrong while reading user. Please try again.")
      }
      console.error("User - Read User unsuccessful:", error)
      return null
    
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authUser?.id) return
    readUser(userId)
  }, [accessToken, authUser?.id])

  return { 
    user, 
    loading, 
    error, 
    refetch: readUser 
  }
}