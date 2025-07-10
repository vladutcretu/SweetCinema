// React, dependencies & packages
import { useGoogleLogin } from '@react-oauth/google'

// App
import { useAuthContext } from '@/contexts/AuthContext'
import { authService } from '@/services/users/authService'

// Components here 


function Login() {
  // Get login logic from context to update auth status
  const { login } = useAuthContext()

  const handleSuccess = async (codeResponse) => {
    try {
    //   console.log(codeResponse)
      const authorizationCode = codeResponse.code
      const response = await authService.authGoogle(authorizationCode)

      if (response.data?.user) {
        login(response.data.tokens.access, response.data.tokens.refresh)
        console.log('Auth with Google successful:', response.data)
      } else {
        console.error("Unexpected response:", response.data)
      }
    } catch (error) {
      console.error("Auth with Google error:", error)
    }
  }

  const handleError = (error) => {
    console.error('Auth with Google unsuccessful:', error)
  }

  const authGoogle = useGoogleLogin({
    onSuccess: handleSuccess,
    onError: handleError,
    flow: 'auth-code'
  })

  return (
    <p onClick={authGoogle}>Log In</p>
  )
}

export default Login