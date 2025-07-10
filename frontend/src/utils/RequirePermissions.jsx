// App
import { useAuthContext } from "../contexts/AuthContext"

// Components here


function RequirePermission({ groups = [], staff = false, superuser = false, fallback = null, children }) {
  const { user } = useAuthContext()

  if (!user) return fallback

  const inGroup = groups.length === 0 || groups.some(group => user.groups?.includes(group))
  const isStaff = !staff || user.is_staff
  const isSuper = !superuser || user.is_superuser

  return inGroup && isStaff && isSuper ? children : fallback
}

export default RequirePermission