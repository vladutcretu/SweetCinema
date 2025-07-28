// React, dependencies & packages
import { useState } from "react"

// App
import { useAuthContext } from "@/contexts/AuthContext"
import { authService } from "@/services/users/authService"

// Components here


export const useVerifyPass = () => {
  const { setTwoFactorAuth } = useAuthContext()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const verifyPasswordStaff = async (password) => {
    setLoading(true)
    setError(null)
    setData(null)
    try {
      const response = await authService.verifyPassword(password)
      setData(response.data)
      setTwoFactorAuth(true)
      console.log("Staff - Verify Password successful:", response.data)
      return response.data
    } catch (error) {
      setError("Something went wrong while verifying password. Please try again.")
      console.error("Staff - Verify Password unsuccessful:", error)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { verifyPasswordStaff, loading, error, data }
}
