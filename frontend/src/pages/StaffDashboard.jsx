// React, dependencies & packages
import React from 'react'

// App
import UserManagement from '../components/staff/UserManagement'

// Write components here


const StaffDashboard = () => {
  return (
    <>
    <div><h1>Staff Dashboard</h1></div>

    {/* After tests are completed component will only be visible to users with: is_staff: true */}
    <div style={{ backgroundColor: "#D2691E" }}><UserManagement /></div><br />
    </> 
  )
}

export default StaffDashboard
