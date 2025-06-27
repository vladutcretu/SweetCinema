// React, dependencies & packages
import React from 'react'

// App
import RequirePermission from '../components/auth/RequirePermissions'
import UserManagement from '../components/staff/UserManagement'

// Write components here


const StaffDashboard = () => {
  return (
    <>
    <div><h1>Staff Dashboard</h1></div>

    <RequirePermission staff={true} fallback={<p>Only staff can see UserManagement.</p>}><UserManagement /></RequirePermission>
    </> 
  )
}

export default StaffDashboard
