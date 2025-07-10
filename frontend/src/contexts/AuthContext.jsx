// React, dependencies & packages
import { createContext, useState, useEffect, useContext } from "react"

// App
import { setAuthToken } from "@/services/Api"
import { authService } from "@/services/users/authService"

// Write components here


const AuthContext = createContext()
 
export function AuthProvider({ children }) {
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
      if (error.response?.status === 401) { return false } // token expired
    }
  }

  // POST with refreshToken to obtain a new accessToken
  const getAccessUsingRefresh = async() => {
    const refreshToken = sessionStorage.getItem("refresh_token")
    if (!refreshToken) return false

    try {
      const response = await authService.refreshToken(refreshToken)
      sessionStorage.setItem("access_token", response.data.access) // development only
      setAccessToken(response.data.access)
      setAuthToken(response.data.access)
      setIsAuthenticated(true)
      await getUserData()
      return true
    } catch {
      return false
    }
  }

  // GET current user data: username, groups, is_staff etc.
  const getUserData = async () => {
    try {
      const response = await authService.getUserData()
      setUser(response.data)
      console.log("Get User Data successful:", response.data)
    } catch (error) {
      console.error("Get User Data unsuccessful:", error)
    }
  }

  // Verify current accessToken before getting a new one using refreshToken
  useEffect(() => {
    const checkAccessToken = async () => {
      const access = accessToken || sessionStorage.getItem("access_token")
      if (!access) {
        const refreshed = await getAccessUsingRefresh()
        if (!refreshed) setUser(null)
        return
      }
      const valid = await verifyAccessToken(access)
      if (valid) {
        setAccessToken(access)
        setAuthToken(access)
        setIsAuthenticated(true)
        await getUserData()
      } else {
        const refreshed = await getAccessUsingRefresh()
        if (!refreshed) setUser(null)
        return
      }
    }

    checkAccessToken()
  }, [])

    // Login logic to update auth status and user data
  const login = async (access, refresh) => {
    sessionStorage.setItem("access_token", access)
    sessionStorage.setItem("refresh_token", refresh)
    setIsAuthenticated(true)
    setAccessToken(access)
    await getUserData()
  }

    // Logout logic to update auth status and user data
  const logout = async () => {
    sessionStorage.removeItem("access_token")
    sessionStorage.removeItem("refresh_token")
    setIsAuthenticated(false)
    setAccessToken(null)
    setUser(null)
    setTwoFactorAuth(false)
}


  return (
    <AuthContext
      value={{
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