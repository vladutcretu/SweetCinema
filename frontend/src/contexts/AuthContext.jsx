// React, dependencies & packages
import { createContext, useState, useEffect, useContext } from "react"

// App
const api_url = import.meta.env.VITE_API_URL

// Write components here


const AuthContext = createContext()
 
export function AuthProvider({ children }) {
    // State for user auth status, user account details and user's access token
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [user, setUser] = useState(null)
    const [accessToken, setAccessToken] = useState(null)

    const verifyAccessToken = async (token) => {
        /**
        Get the local saved `access token` to fetch with it in order to
        verify his status (expired or not).
        */
        const response = await fetch(`${api_url}/users/token/verify/`, {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json'}, 
            body: JSON.stringify({ token })
        })
        return response.ok
    }

    const getAccessUsingRefresh = async() => {
        /**
        Get the local saved `refresh token` to fetch with it in order to
        generate a new `access token`.
        */
        const refresh = sessionStorage.getItem("refresh_token")
        if (!refresh) return false

        const response = await fetch(`${api_url}/users/token/refresh/`, {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ refresh })
        })
        if (!response.ok) return false

        const data = await response.json()
        sessionStorage.setItem("access_token", data.access) // for developing purposes; remove line after
        setAccessToken(data.access)
        return true
    }

    useEffect(() => {
        /**
        Verify current `access token` before getting a new one using `refresh token`
        */
        const checkAuth = async () => {
            const access = accessToken || sessionStorage.getItem("access_token")
            if (!access) {
                const refreshed = await getAccessUsingRefresh()
                setIsAuthenticated(refreshed)
                if (!refreshed) setUser(null)
                return
            }

            const valid = await verifyAccessToken(access)
            if (valid) {
                setAccessToken(access)
                setIsAuthenticated(true)
                await fetchUser(access)
            } else {
                const refreshed = await getAccessUsingRefresh()
                setIsAuthenticated(refreshed)
                if (!refreshed) setUser(null)
            }
        }

        checkAuth()
    }, [])


    // Fetch current user to get his data: username, groups, is_staff etc.
    const fetchUser = async (token) => {
        const response = await fetch(`${api_url}/users/user/`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        if (response.ok) {
            const data = await response.json()
            setUser(data)
            console.log("Fetched user data:", data)
        }
    }

    // Login logic to update auth status and user data
    const login = async (access, refresh) => {
        sessionStorage.setItem("access_token", access)
        sessionStorage.setItem("refresh_token", refresh)
        setIsAuthenticated(true)
        setAccessToken(access)
        await fetchUser(access)
    }

    // Logout logic to update auth status and user data
    const logout = async () => {
        sessionStorage.removeItem("access_token")
        sessionStorage.removeItem("refresh_token")
        setIsAuthenticated(false)
        setAccessToken(null)
        setUser(null)
    }


    return (
        <AuthContext
            value={{
                isAuthenticated,
                accessToken,
                user,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext>
    )
}

export function useAuthContext() {
    return useContext(AuthContext)
}
