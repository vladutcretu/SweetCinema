// React, dependencies & packages
import { useGoogleLogin } from '@react-oauth/google'
import { useNavigate } from "react-router-dom"

// App
import { useAuthContext } from '../../contexts/AuthContext'

// Write components here


function Login() {
    const api_url = import.meta.env.VITE_API_URL

    // Get login logic from context to update auth status
    const { login } = useAuthContext()

    const handleSuccess = (codeResponse) => {
        console.log(codeResponse)
        const authorizationCode = codeResponse.code

        // Ask for response from backend
        fetch(`${api_url}/users/auth-google/`, {
           method: 'POST',
           headers: {
            'Content-Type': 'application/json',
           },
           body: JSON.stringify({code: authorizationCode})
        })
        .then(response => response.json())
        .then(data => {
            // Handle the response from backend
            if (data?.user) {
                console.log('Login successful:', data)
                login(
                    data.user.username,
                    data.tokens.access, 
                    data.tokens.refresh
                )
            } else {
                console.error('Unexpected response format:', data)
            }
        })
        .catch(error => {
            console.error('Error exchanging code:', error)
        })
    }

    const handleError = (errorResponse) => {
        console.error('Auth with Google failed', errorResponse)
    }

    const auth = useGoogleLogin({
        onSuccess: handleSuccess,
        onError: handleError,
        flow: 'auth-code'
    })

    return (
        <>
            <p onClick={auth}>Log In</p>
        </>
    )
}

function Logout() {
    // Get logout logic from context to update auth status
    const { logout } = useAuthContext()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    return (
        <>
            <p onClick={handleLogout}>Log Out</p>
        </>
  )
}

function GoogleAuth() {
    // Get auth status from context to show correct component
    const { isAuthenticated } = useAuthContext()

    return (
        <>
        {isAuthenticated ? <Logout /> : <Login />}
        </>
    )

}

export default GoogleAuth
