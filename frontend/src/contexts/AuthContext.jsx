// React, dependencies & packages
import { createContext, useState, useEffect, useRef, useCallback, useContext } from "react"

// App
import { authService } from "@/services/users/authService"
import { setAuthToken } from "@/services/Api"

// Write components here


const AuthContext = createContext()
 
export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true)
  // State for user's access token, account details, and auth, 2FA status
  const [accessToken, setAccessToken] = useState(null)
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [twoFactorAuth, setTwoFactorAuth] = useState(() => {
    return sessionStorage.getItem("twoFactorAuth") === "true"
  }) // for role users


//////////////////////////////////////////////////////////////////////////////
// Get current user data & 2FA status
//////////////////////////////////////////////////////////////////////////////
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

  // Save 2FA status in sessionStorage
  useEffect(() => {
    if (twoFactorAuth) {
      sessionStorage.setItem("twoFactorAuth", "true")
    } else {
      sessionStorage.removeItem("twoFactorAuth")
    }
  }, [twoFactorAuth])


//////////////////////////////////////////////////////////////////////////////
// Get acccess token (auto-refresh when almost expire)
//////////////////////////////////////////////////////////////////////////////
  const refreshTimerRef = useRef(null)
  const isRefreshingRef = useRef(false)

  // Parse payload of JWT access to extract expiration time
  const getTokenExpirationTime = useCallback((accessToken) => {
    try {
      const payload = JSON.parse(atob(accessToken.split(".")[1]))
      return payload.exp * 1000 // miliseconds
    } catch {
      return null
    }
  }, [])

  // Refresh access token using refresh token
  const performTokenRefresh = useCallback(async () => {
    if (isRefreshingRef.current) return false

    isRefreshingRef.current = true
    const refreshToken = sessionStorage.getItem("refresh_token")

    if (!refreshToken) {
      isRefreshingRef.current = false
      return false
    }

    try {
      console.log("🔄 Auto-refreshing access token...")
      const response = await authService.refreshToken(refreshToken)
      const newAccessToken = response.data.access

      sessionStorage.setItem("access_token", newAccessToken)
      setAccessToken(newAccessToken)
      setAuthToken(newAccessToken)
      await getUserData()
      setIsAuthenticated(true)

      console.log("✅ Access token refreshed successfully!")
      return true
    } catch {
      console.error("❌ Access token refresh failed:", error)
      await logout()
      return false
    } finally {
      isRefreshingRef.current = false
    }
  }, [getUserData])

  // Set timer for next refresh
  const scheduleTokenRefresh = useCallback((accessToken) => {
    // Clean up previous timer
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current)

    const expirationTime = getTokenExpirationTime(accessToken)
    if (!expirationTime) return 

    const now = Date.now()
    const timeUntilExpiry = expirationTime - now 

    // Refresh 1 minute before expiring or immediately if expired
    const refreshTime = Math.max(timeUntilExpiry - (1 * 60 * 1000), 1000)
    console.log(`🔄 Access token will be refreshed in ${Math.round(refreshTime / 1000)} seconds!`)
  
    refreshTimerRef.current = setTimeout(() => {
      performTokenRefresh()
    }, refreshTime)
  }, [getTokenExpirationTime, performTokenRefresh])


//////////////////////////////////////////////////////////////////////////////
// Use access token (save and check)
//////////////////////////////////////////////////////////////////////////////

  // Save access token globally (interceptor) when it changes
  useEffect(() => {
    if (accessToken) {
      setAuthToken(accessToken)
      scheduleTokenRefresh(accessToken)
    } else { // clean up token from interceptor and auto-refresh timer
      setAuthToken(null)
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current)
      }
    }
  }, [accessToken])

  // Verify access token availability
  const verifyAccessToken = useCallback(async (accessToken) => {
    try {
      const response = await authService.verifyToken(accessToken)
      return response.status === 200
    } catch (error) {
      if (error.response?.status === 401) { 
        return false // token expired
      }
      throw error
    }
  }, [])

  // Initial auth logic
  useEffect(() => {
    const checkAccessToken = async () => {
      try {
        const access = accessToken || sessionStorage.getItem("access_token")

        if (!access) {
          console.log("🔄 No access token found, refreshing...")
          const refreshed = await performTokenRefresh()
          if (!refreshed) {
            setUser(null)
            setIsAuthenticated(false)
          }
          return
        }

        setAccessToken(access)
        setAuthToken(access)

        const valid = await verifyAccessToken(access)
        if (valid) {
          console.log("✅ Auth check successfully (access token is valid)!")
          await getUserData()
          setIsAuthenticated(true)
        } else {
          console.log("🔄 Access token expired, refreshing...")
          await performTokenRefresh()
        }
      } catch (error) {
        console.error("❌ Auth check failed (access token is not valid):", error)
        setUser(null)
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }

    const timer = setTimeout(checkAccessToken, 100)
    return () => clearTimeout(timer)
  }, [])


//////////////////////////////////////////////////////////////////////////////
// Login & Logout logic
//////////////////////////////////////////////////////////////////////////////
  const login = useCallback(async (access, refresh) => {
    try {
      sessionStorage.setItem("access_token", access)
      sessionStorage.setItem("refresh_token", refresh)

      setAccessToken(access)
      await getUserData()
      setIsAuthenticated(true)

    } catch (error) {
      console.error("❌ Login failed:", error)
      await logout()
    }
  }, [getUserData])

  const logout = useCallback(async () => {
    // Cleanup auto-refresh timer
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current)
    }

    sessionStorage.removeItem("access_token")
    sessionStorage.removeItem("refresh_token")

    setAccessToken(null)

    setUser(null)
    setIsAuthenticated(false)
    setTwoFactorAuth(false)
}, [])


//////////////////////////////////////////////////////////////////////////////
// Cleanup timer on unmount
//////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current)
      }
    }
  }, [])

  return (
    <AuthContext
      value={{
        loading,
        accessToken,
        refreshToken: performTokenRefresh,
        login,
        logout,
        user,
        isAuthenticated,
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