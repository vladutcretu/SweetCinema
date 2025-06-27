// React, dependencies & packages
import React from 'react'

// App
import RequirePermission from '../components/auth/RequirePermissions'
import UserManagement from '../components/staff/UserManagement'
import { useAuthContext } from '../contexts/AuthContext'

// Write components here


const StaffDashboard = () => {
  // Get context for testing purposes
  const { user } = useAuthContext()

  return (
    <>
    <div>
      <h1>Staff Dashboard</h1>
      <h5>User: {user?.username}; User group: {user?.groups.join(", ")}; User staff: {user?.is_staff.toString()}; User superuser: {user?.is_superuser.toString()}</h5>
      <br />
    </div>

    <RequirePermission staff={true} fallback={<p>Only staff can see UserManagement.</p>}><UserManagement /></RequirePermission>
    </> 
  )
}

export default StaffDashboard
