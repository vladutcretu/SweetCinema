// React, dependencies & packages
import React from 'react'

// App
import RequirePermission from '../utils/RequirePermissions'
import UserManagement from '../components/staff/UserManagement'
import { useAuthContext } from '../contexts/AuthContext'
import GenreManagement from '../components/staff/GenreManagement'
import MovieManagement from '../components/staff/MovieManagement'
import CityManagement from '../components/staff/CityManagement'
import TheaterManagement from '../components/staff/TheaterManagement'
import ShowtimeManagement from '../components/staff/ShowtimeManagement'
import BookingManagement from '../components/staff/BookingManagement'
import PaymentManagement from '../components/staff/PaymentManagement'
import PasswordSet from '../components/profile/PasswordSet'
import PasswordVerify from '../components/profile/PasswordVerify'
import BookingDashboard from '../components/staff/BookingDashboard'
import ShowtimeDashboard from '../components/staff/ShowtimeDashboard'
import ShowtimeReport from '../components/staff/ShowtimeReport'

// Write components here


const StaffDashboard = () => {
  // Get context for testing purposes
  const { user, twoFactorAuth } = useAuthContext()

  if (!user?.password) {
    return (<PasswordSet />)
  }
  
  if (!twoFactorAuth) {
    return (<PasswordVerify />)
  }

  return (
    <>
    <div>
      <h1>Staff Dashboard</h1>
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
    <br />
    <RequirePermission groups={["Cashier"]} fallback={<p>Only Cashier group can see BookingDashboard.</p>}><BookingDashboard /></RequirePermission>
    <br />
    <RequirePermission groups={["Cashier"]} fallback={<p>Only Cashier group can see ShowtimeDashboard.</p>}><ShowtimeDashboard /></RequirePermission>
    <br />
    <RequirePermission groups={["Manager"]} fallback={<p>Only Manager group can see ShowtimeReport.</p>}><ShowtimeReport /></RequirePermission>
    </>
  )
}

export default StaffDashboard
