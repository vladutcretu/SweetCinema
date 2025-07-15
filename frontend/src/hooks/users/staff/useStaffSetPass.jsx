// React, dependencies & packages
import { useState } from "react"

// App
import { useAuthContext } from "@/contexts/AuthContext"
import { authService } from "@/services/users/authService"

// Components here


export const useStaffSetPass = () => {
  const { setTwoFactorAuth } = useAuthContext()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const setPasswordStaff = async (password) => {
    setLoading(true)
    setError(null)
    setData(null)
    try {
      const response = await authService.setPasswordStaff(password)
      setData(response.data)
      setTwoFactorAuth(true)
      console.log("Set Password Staff successful:", response.data)
      return response.data
    } catch (error) {
      setError("Something went wrong while setting password for staff. Please try again.")
      console.error("Set Password Staff unsuccessful:", error)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { setPasswordStaff, loading, error, data }
}
