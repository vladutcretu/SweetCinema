// React, dependencies & packages
import { useEffect, useState } from "react"

// App
import { useAuthContext } from "@/contexts/AuthContext"
import { userService } from "@/services/users/userService"

// Components here


export const useGetUsers = () => {
  const { accessToken } = useAuthContext()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await userService.getUsers()
      setUsers(response.data)
      console.log("Get Users successful:", response.data)
      return response.data
    } catch (error) {
      setError("Something went wrong while getting users. Please try again.")
      console.error("Get Users unsuccessful:", error)
      return null
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
      getUsers()
  }, [accessToken])

  return { users, loading, error, refetch: getUsers }
}