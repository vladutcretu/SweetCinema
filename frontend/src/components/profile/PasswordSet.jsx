// React, dependencies & packages
import React, { useState } from 'react'

// App
import { useAuthContext } from '../../contexts/AuthContext'
const api_url = import.meta.env.VITE_API_URL

// Write components here 


const PasswordSet = () => {
  // Get context for access
  const { accessToken } = useAuthContext()

  const [password, setPassword] = useState("")
  
  const handleChange = (event) => {
    setPassword(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    postSetPassword()
    setPassword("")
  }

// Fetch to set password
  const postSetPassword = async () => {
    try {
      const response = await fetch(`${api_url}/users/user/set-password/`, {
        method: 'POST', 
        headers : {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ new_password: password })
      })
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Set password failed:', errorData)
        alert('Set password failed: ' + (errorData?.detail || response.status))
      } else {
        const data = await response.json()
        console.log(data)
        alert(`Set password success!`)
        window.location.reload()
      }
    } catch (error) {
        console.error('Set password error', error)
        alert('Something went wrong while setting password.')
    }
  }

  return (
    <>
    <div>
      <h1>PasswordSet</h1>
      <p>You don't have a password for your account, please set it in order to access Staff Dashboard!</p>
      <form onSubmit={handleSubmit}>
        <label>Password: </label>
        <input type="password" value={password} onChange={handleChange} required></input>
        <button type="submit">Set password</button>
      </form>
    </div>
    </>
  )
}

export default PasswordSet