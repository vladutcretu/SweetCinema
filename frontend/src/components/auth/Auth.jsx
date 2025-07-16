// App
import { useAuthContext } from '../../contexts/AuthContext'
import Logout from './Logout'
import Login from './Login'

// Components here


function Auth() {
    // Get auth status from context to show correct component
    const { isAuthenticated } = useAuthContext()

    return isAuthenticated ? <Logout /> : <Login />
}

export default Auth