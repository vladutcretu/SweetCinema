// React, dependencies & packages
import React, { useEffect, useState } from 'react'

// App
import { useAuthContext } from '../../contexts/AuthContext'
const api_url = import.meta.env.VITE_API_URL

// Write components here


const UserManagement = () => {
    // Fetch User data
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Get context for access
    const { accessToken } = useAuthContext()
    
    // Get users list (outside of useEffect to call when update groups)
    const getUserList = async() => {
        try {
            const response = await fetch(`${api_url}/users/`, {
                method: 'GET',
                headers: {'Authorization': `Bearer ${accessToken}`}
            })
            if (!response.ok) {
                throw new Error (`HTTP error! Response status: ${response.status}`)
            } else {
                const data = await response.json()
                console.log(data)
                setUsers(data)
            }
        } catch (error) {
            console.error('Fetching User error', error)
            setError('Users cannot be loaded. Please try again!')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getUserList()
    }, [])

    // Filter data using Search Bar
    const [searchTerm, setSearchTerm] = useState("")

    const handleChangeSearch = (event) => {
        setSearchTerm(event.target.value)
    }

    const filteredUsers = users.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Promote / Demote user
    const [userId, setUserId] = useState("")
    const [action, setAction] = useState([])

    const handleButtonActions = (userId, action) => {
        setUserId(userId)
        if (action === "User") {
            setAction([])
        } else {
            setAction([action])
        }
    }

    const handleSubmitActions = (event) => {
        event.preventDefault()
        patchUserGroups()
    }

    // Fetch to update user
    const patchUserGroups = async () => {
        try {
            const response = await fetch(`${api_url}/users/user/update/${userId}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ groups: action })
            })
            if (!response.ok) {
                const errorData = await response.json()
                console.error('Update user failed:', errorData)
                alert('Update failed: ' + (errorData?.detail || response.status))
            } else {
                const data = await response.json()
                console.log(data)
                alert(`Completed: USER ID ${userId} group updated!`)
                // Fetch again
                await getUserList()
            }
        } catch (error) {
            console.error('Fetching User Update error', error)
            alert('Something went wrong while updating user.')
        }
    }

    // Update City for Cashier
    const [updatedForm, setUpdatedForm] = useState(
    { id: "", city: "" }
    )

    const handleChangeUpdate = (event) => {
        const { name, value } = event.target
        setUpdatedForm(prev => ({ ...prev, [name]: value }))
    }

    // Submit update on update tab
    const handleSubmitUpdate = (event) => {
        event.preventDefault()
        patchCashierCityUpdate()
        setUpdatedForm({ id: "", city: "" })
    }

    const patchCashierCityUpdate = async () => {
        try {
            const response = await fetch(`${api_url}/users/user/update-city/${updatedForm.id}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ city: updatedForm.city })
            })
            if (!response.ok) {
                const errorData = await response.json()
                console.error('Update user city failed:', errorData)
                alert('Update user city failed: ' + (errorData?.detail || response.status))
            } else {
                const data = await response.json()
                console.log(data)
                alert(`Completed: USER city got updated!`)
                // Fetch again
                await getUserList()
            }
        } catch (error) {
            console.error('Fetching User Update City error', error)
            alert('Something went wrong while updating user city.')
        }
    }

  return (
    <>
    <div style={{ backgroundColor: "#D2691E" }}>
        <h3>User Management</h3>

        {/* Search Bar */}
        <div>
            <label>Search user:</label>
            <input type="text" value={searchTerm} onChange={handleChangeSearch} placeholder="Type username..."></input>
        </div>

        {/* User data */}
        <table style={{ border: "1px solid black", width: "100%" }}>
            <thead>
                <tr>
                    <th style={{ border: "1px solid black" }}>ID</th>
                    <th style={{ border: "1px solid black" }}>Email</th>
                    <th style={{ border: "1px solid black" }}>Username</th>
                    <th style={{ border: "1px solid black" }}>Groups</th>
                    <th style={{ border: "1px solid black" }}>Actions</th>
                </tr>
            </thead>
            <tbody>
                {loading && (<tr><td colSpan="4">User list is loading...</td></tr>)}
                {error && (<tr><td colSpan="4">{error}</td></tr>)}
                {!loading && !error && filteredUsers.length === 0 && (
                    <tr>
                        <td colSpan="4">Currently there are no users to show.</td>
                    </tr>
                )}
                {!loading && !error && filteredUsers.length > 0 && filteredUsers.map(user => (
                    <tr key={user.id}>
                        <td style={{ border: "1px solid black" }}>{user.id}</td>
                        <td style={{ border: "1px solid black" }}>{user.email}</td>
                        <td style={{ border: "1px solid black" }}>{user.username}</td>
                        <td style={{ border: "1px solid black" }}>{user.groups.join(", ")}</td>
                        {/* Promote / Demote buttons */}
                        <td style={{ border: "1px solid black" }}>
                            <form onSubmit={handleSubmitActions}>
                                <button  type="submit" onClick={() =>
                                    handleButtonActions(user.id, "Manager")
                                }>Promote to Manager</button>
                                <button  type="submit" onClick={() =>
                                    handleButtonActions(user.id, "Employee")
                                }>Promote to Employee</button>
                                <button  type="submit" onClick={() =>
                                    handleButtonActions(user.id, "Cashier")
                                }>Promote to Cashier</button>
                                <button type="submit" onClick={() =>
                                    handleButtonActions(user.id, "User")
                                }>Demote to User</button>
                            </form>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        
        <br />

        {/* Update city location for a Cashier */}
        <h4>Update City for Cashier</h4>
        <form onSubmit={handleSubmitUpdate}>
            <label>ID: </label>
            <input type="number" name="id" value={updatedForm.id} onChange={handleChangeUpdate} required /><br />
            <label>City: </label>
            <input type="text" name="city" value={updatedForm.city} onChange={handleChangeUpdate} required /><br />
            <button type="submit">Update City for Cashier</button>
        </form>
    </div>
    </>
  )
}

export default UserManagement
