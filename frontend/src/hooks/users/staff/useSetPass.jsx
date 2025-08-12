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

    try {
      const response = await authService.setPassword(password)
      setData(response.data)
      setTwoFactorAuth(true)
      console.log("Staff - Set Password successful:", response.data)
      alert(`✅ You set your account password (2FA) successful!`)
      location.reload()
      return response.data
    
    } catch (error) {
      if (error.response?.data) {
        const backendErrors = error.response.data
        const errorMessages = Object.values(backendErrors).flat().join("\n")
        setError(`Something went wrong while setting password: ${errorMessages}`)
        alert(`❌ Password not created!\n${errorMessages}`)
      } else {
        setError("Something went wrong while setting password. Please try again.")
        alert(`❌ Password not created!`)
      }
      console.error("Staff - Set Password unsuccessful:", error)
      location.reload()
      return null
    
    } finally {
      setLoading(false)
    }
  }

  return { 
    setPasswordStaff, 
    loading, 
    error, 
    data 
  }
}
