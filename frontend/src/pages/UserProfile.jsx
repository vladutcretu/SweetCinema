// React, dependencies & packages
import React from 'react'

// App
import { useAuthContext } from '../contexts/AuthContext'
import BookingHistory from '../components/profile/BookingHistory'
const api_url = import.meta.env.VITE_API_URL

// Write components here


const UserProfile = () => {
  const { user } = useAuthContext()

  return (
    <>
    <div>
      <h1>UserProfile</h1>
      <br />
      <div>
        <h3>Account information</h3>
        <p><strong>Username / email:</strong> {user?.username} / {user?.email}</p>
        <p><strong>Groups:</strong> {user?.groups.join(", ")}</p>
        <p><strong>Staff:</strong> {user?.is_staff.toString()}</p>
        <p><strong>Superuser:</strong> {user?.is_superuser.toString()}</p>
      </div>
      <br />
      <BookingHistory />
    </div>
    </>
  )
}

export default UserProfile
