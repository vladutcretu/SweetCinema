// React, dependencies & packages
import { createContext, useState, useEffect, useContext } from "react"

// Write components here


const AuthContext = createContext()
 
export function AuthProvider({ children }) {
    const api_url = import.meta.env.VITE_API_URL

    const [isAuthenticated, setIsAuthenticated] = useState(false)

    const verifyAccessToken = async () => {
        /**
        Get the local saved `access token` to fetch with it in order to
        verify his status (expired or not).
        */
        const access = localStorage.getItem("access_token")
        if (!access) return false

        const response = await fetch(`${api_url}/users/token/verify/`, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
            }, 
            body: JSON.stringify({ token: access })
        })

        return response.ok
    }

    const getAccessUsingRefresh = async() => {
        /**
        Get the local saved `refresh token` to fetch with it in order to
        generate a new `access token`.
        */

        const refresh = localStorage.getItem("refresh_token")
        if (!refresh) return false

        try {
            const response = await fetch(`${api_url}/users/token/refresh/`, {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                }, 
                body: JSON.stringify({ refresh })
            })
            if (!response.ok) return false

            const data = await response.json()
            localStorage.setItem("access_token", data.access)
            return true
        } catch {
            return false
        }
    }

    // Verify current `access token` before getting a new one using `refresh token`
    useEffect(() => {
        const checkAuth = async () => {
            const valid = await verifyAccessToken()
            if (valid) {
                setIsAuthenticated(true)
            } else {
                const refreshed = await getAccessUsingRefresh()
                setIsAuthenticated(refreshed)
            }
        }

        checkAuth()
    }, [])

    // Login logic to update auth status
    const login = (username, access, refresh) => {
        localStorage.setItem("username", username)
        localStorage.setItem("access_token", access)
        localStorage.setItem("refresh_token", refresh)
        setIsAuthenticated(true)
    }

    // Logout logic to update auth status
    const logout = () => {
        localStorage.removeItem("username")
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
        setIsAuthenticated(false)
        console.log("Logout successful.")
    }

    return (
        <AuthContext
            value={{ 
                isAuthenticated, 
                login, 
                logout
            }}
        >
            {children}
        </AuthContext>
    )
}

export function useAuthContext() {
    return useContext(AuthContext)
}
