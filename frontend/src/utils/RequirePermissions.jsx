// App
import { useAuthContext } from "../contexts/AuthContext"

// Components here


function RequirePermission({ roles = [], staff = false, superuser = false, fallback = null, children }) {
  const { user } = useAuthContext()

  if (!user) return fallback

  const hasRole = roles.length === 0 || roles.includes(user.role)
  const isStaff = !staff || user.is_staff
  const isSuper = !superuser || user.is_superuser

  return hasRole && isStaff && isSuper ? children : fallback
}

export default RequirePermission