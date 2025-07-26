// React, dependencies & packages
import { useEffect, useState } from "react"

// App
import { useAuthContext } from "@/contexts/AuthContext"
import { userService } from "@/services/users/userService"

// Components here


export const useReadUsers = () => {
  const { accessToken } = useAuthContext()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const readUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await userService.readUsers()
      setUsers(response.data)
      console.log("Staff - Read Users successful:", response.data)
      return response.data
    } catch (error) {
      setError("Something went wrong while reading users. Please try again.")
      console.error("Staff - Read Users unsuccessful:", error)
      return null
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    readUsers()
  }, [accessToken])

  return { users, loading, error, refetch: readUsers }
}