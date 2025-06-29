// React, dependencies & packages
import React from 'react'

// App
import RequirePermission from '../components/auth/RequirePermissions'
import UserManagement from '../components/staff/UserManagement'
import { useAuthContext } from '../contexts/AuthContext'
import GenreManagement from '../components/staff/GenreManagement'
import MovieManagement from '../components/staff/MovieManagement'
import CityManagement from '../components/staff/CityManagement'
import TheaterManagement from '../components/staff/TheaterManagement'
import ShowtimeManagement from '../components/staff/ShowtimeManagement'
import BookingManagement from '../components/staff/BookingManagement'
import PaymentManagement from '../components/staff/PaymentManagement'

// Write components here


const StaffDashboard = () => {
  // Get context for testing purposes
  const { user } = useAuthContext()

  return (
    <>
    <div>
      <h1>Staff Dashboard</h1>
      <h5>User: {user?.username}; User group: {user?.groups.join(", ")}; User staff: {user?.is_staff.toString()}; User superuser: {user?.is_superuser.toString()}</h5>
    </div>
    <br />
    <RequirePermission staff={true} fallback={<p>Only staff can see UserManagement.</p>}><UserManagement /></RequirePermission>
    <br />
    <RequirePermission groups={["Manager", "Employee"]} fallback={<p>Only Manager & Employee groups can see GenreManagement.</p>}><GenreManagement /></RequirePermission>
    <br />
    <RequirePermission groups={["Manager", "Employee"]} fallback={<p>Only Manager & Employee groups can see MovieManagement.</p>}><MovieManagement /></RequirePermission>
    <br />
    <RequirePermission groups={["Manager"]} fallback={<p>Only Manager group can see CityManagement.</p>}><CityManagement /></RequirePermission>
    <br />
    <RequirePermission groups={["Manager"]} fallback={<p>Only Manager group can see TheaterManagement.</p>}><TheaterManagement /></RequirePermission>
    <br />
    <RequirePermission groups={["Manager", "Employee"]} fallback={<p>Only Manager & Employee groups can see GenreManagement.</p>}><ShowtimeManagement /></RequirePermission>
    <br />
    <RequirePermission groups={["Manager"]} fallback={<p>Only Manager group can see BookingManagement.</p>}><BookingManagement /></RequirePermission>
    <br />
    <RequirePermission groups={["Manager"]} fallback={<p>Only Manager group can see PaymentManagement.</p>}><PaymentManagement /></RequirePermission>
    </>
  )
}

export default StaffDashboard
