// React, dependencies & packages
import { useState } from "react"

// App
import { useAuthContext } from "@/contexts/AuthContext"
import { authService } from "@/services/users/authService"

// Components here


export const useResetPass = () => {
  const { setTwoFactorAuth, logout } = useAuthContext()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const resetPasswordStaff = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await authService.resetPassword()
      setData(response.data)
      setTwoFactorAuth(true)
      console.log("Staff - Reset Password successful (email should be sent):", response.data)
      alert(`✅ You reset your account password (2FA) successful! Please check the sent email with reset instructions!`)
      logout()
      return response.data
    
    } catch (error) {
      if (error.response?.data) {
        const backendErrors = error.response.data
        const errorMessages = Object.values(backendErrors).flat().join("\n")
        setError(`Something went wrong while resetting password: ${errorMessages}`)
        alert(`❌ Password not reseted!\n${errorMessages}`)
      } else {
        setError("Something went wrong while resetting password. Please try again.")
        alert(`❌ Password not reseted!`)
      }
      console.error("Staff - Reset Password unsuccessful:", error)
      location.reload()
      return null
    
    } finally {
      setLoading(false)
    }
  }

  return { 
    resetPasswordStaff, 
    loading, 
    error, 
    data 
  }
}
