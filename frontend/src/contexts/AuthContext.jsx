// React, dependencies & packages
import { createContext, useState, useEffect, useContext } from "react"

// App
import { setAuthToken } from "@/services/Api"
import { authService } from "@/services/users/authService"

// Write components here


const AuthContext = createContext()
 
export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true)
  // State for user auth status, user account details and user's access token
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [accessToken, setAccessToken] = useState(null)
  const [twoFactorAuth, setTwoFactorAuth] = useState(() => {
    return sessionStorage.getItem("twoFactorAuth") === "true"
  }) // for role users

  // Save accessToken globally (interceptor) when it changes
  useEffect(() => {
    if (accessToken) {
      setAuthToken(accessToken)
    } else {
      setAuthToken(null) // clean up token from interceptor
    }
  }, [accessToken])

  // Save 2FA status in sessionStorage
  useEffect(() => {
    if (twoFactorAuth) {
      sessionStorage.setItem("twoFactorAuth", "true")
    } else {
      sessionStorage.removeItem("twoFactorAuth")
    }
  }, [twoFactorAuth])

  // POST with accessToken to verify his availability
  const verifyAccessToken = async (accessToken) => {
    try {
      const response = await authService.verifyToken(accessToken)
      return response.status === 200
    } catch (error) {
      if (error.response?.status === 401) { 
        return false // token expired
      }
      throw error
    }
  }

  // POST with refreshToken to obtain a new accessToken
  const getAccessUsingRefresh = async() => {
    const refreshToken = sessionStorage.getItem("refresh_token")
    if (!refreshToken) {
      console.log("No refresh token available")
      return false
    }

    try {
      const response = await authService.refreshToken(refreshToken)
      const newAccessToken = response.data.access
      
      sessionStorage.setItem("access_token", newAccessToken) // development only
      setAccessToken(newAccessToken)
      setAuthToken(newAccessToken)
      setIsAuthenticated(true)

      await getUserData()
      return true
    } catch (error) {
      console.error("Refresh token failed:", error)
      await logout()
      return false
    }
  }

  // GET current user data: username, groups, is_staff etc.
  const getUserData = async () => {
    try {
      const response = await authService.getUserData()
      setUser(response.data)
      console.log("Read User Data successful:", response.data)
    } catch (error) {
      console.error("Read User Data unsuccessful:", error)
      throw error
    }
  }

  // Verify current accessToken before getting a new one using refreshToken
  useEffect(() => {
    const checkAccessToken = async () => {
      try {
        const access = accessToken || sessionStorage.getItem("access_token")

        if (!access) {
          console.log("No access token found, refreshing...")
          const refreshed = await getAccessUsingRefresh()
          if (!refreshed) {
            setUser(null)
            setIsAuthenticated(false)
          }
          return
        }

        // Set token in state & interceptor
        setAccessToken(access)
        setAuthToken(access)

        const valid = await verifyAccessToken(access)
        if (valid) {
          console.log("Token is valid")
          setIsAuthenticated(true)
          await getUserData()
        } else {
          console.log("Access token expired, refreshing...")
          const refreshed = await getAccessUsingRefresh()
          if (!refreshed) {
            setUser(null)
            setIsAuthenticated(false)
           }
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        setUser(null)
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }

    checkAccessToken()
  }, [])

  // Login logic to update auth status and user data
  const login = async (access, refresh) => {
    try {
      sessionStorage.setItem("access_token", access)
      sessionStorage.setItem("refresh_token", refresh)

      setAccessToken(access)
      setAuthToken(access)

      setIsAuthenticated(true)

      await getUserData()
    } catch (error) {
      console.error("Login failed:", error)
      await logout()
    }
  }

  // Logout logic to update auth status and user data
  const logout = async () => {
    sessionStorage.removeItem("access_token")
    sessionStorage.removeItem("refresh_token")

    setAccessToken(null)
    setAuthToken(null)
    setIsAuthenticated(true)

    setUser(null)
  
    setIsAuthenticated(false)
    setTwoFactorAuth(false)
}

  return (
    <AuthContext
      value={{
        loading,
        isAuthenticated,
        accessToken,
        user,
        login,
        logout,
        twoFactorAuth,
        setTwoFactorAuth,
      }}
    >
      {children}
    </AuthContext>
    )
}

export function useAuthContext() {
    return useContext(AuthContext)
}