// React, dependencies & packages
import React, { useState } from 'react'

// App
import { useAuthContext } from '../../contexts/AuthContext'
const api_url = import.meta.env.VITE_API_URL

// Write components here 


const PasswordVerify = () => {
  // Get context for access
  const { accessToken, setTwoFactorAuth } = useAuthContext()

  const [password, setPassword] = useState("")

  const handleChange = (event) => {
    setPassword(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    postVerifyPassword()
  }

  // Fetch to check password
  const postVerifyPassword = async () => {
    try {
      const response = await fetch(`${api_url}/users/user/verify-password/`, {
        method: 'POST', 
        headers : {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ password: password })
        })
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Verify password failed:', errorData)
        alert('Verify password failed: ' + (errorData?.detail || response.status))
      } else {
        const data = await response.json()
        console.log(data)
        alert(`Verify password success!`)
        setTwoFactorAuth(true)
        console.log("Two factor auth set to true")
      }
    } catch (error) {
      console.error('Set password error', error)
      alert('Something went wrong while setting password.')
    } 
  }

  return (
    <>
    <div>
      <h1>PasswordVerify</h1>
      <p>You already have a password for your account, please enter it in order to access Staff Dashboard!</p>
        <form onSubmit={handleSubmit}>
          <label>Password: </label>
          <input type="password" value={password} onChange={handleChange} required></input>
            <button type="submit">Submit password</button>
        </form>
    </div>
    </>
  )
}

export default PasswordVerify