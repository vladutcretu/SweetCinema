// React, dependencies & packages
import { useState } from "react"

// App
import { useAuthContext } from "@/contexts/AuthContext"
import { authService } from "@/services/users/authService"

// Components here


export const useSetPass = () => {
  const { setTwoFactorAuth } = useAuthContext()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const setPasswordStaff = async (password) => {
    setLoading(true)
    setError(null)
    setData(null)
    try {
      const response = await authService.setPassword(password)
      setData(response.data)
      setTwoFactorAuth(true)
      console.log("Staff - Set Password successful:", response.data)
      alert(`✅ You set your account password (2FA) successful!`)
      location.reload()
      return response.data
    } catch (error) {
      setError("Something went wrong while setting password. Please try again.")
      console.error("Staff - Set Password unsuccessful:", error)
      alert(`❌ You do not set your account password (2FA). Try again please!`)
      location.reload()
      return null
    } finally {
      setLoading(false)
    }
  }

  return { setPasswordStaff, loading, error, data }
}
