// React, dependencies & packages
import { useNavigate } from "react-router-dom"

// App
import { useAuthContext } from "@/contexts/AuthContext"

// Components here


function Logout() {
  // Get logout logic from context to update auth status
  const { logout } = useAuthContext()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <p onClick={handleLogout}>Log Out</p>
  )
}

export default Logout