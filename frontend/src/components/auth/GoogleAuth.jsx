import { useGoogleLogin } from '@react-oauth/google'

function GoogleAuth() {
    const api_url = import.meta.env.VITE_API_URL

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
                console.log('Login successful:', data.user)
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

export default GoogleAuth
