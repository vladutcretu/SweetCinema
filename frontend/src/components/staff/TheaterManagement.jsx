// React, dependencies & packages
import React, { useState, useEffect } from 'react'

// App
import { useAuthContext } from '../../contexts/AuthContext'
const api_url = import.meta.env.VITE_API_URL

// Write components here


const TheaterManagement = () => {
  // Get context for access
  const { accessToken } = useAuthContext()

  // Fetch City data
  const [theaters, setTheaters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const getTheaterList = async () => {
    try {
        const response = await fetch(`${api_url}/locations/theaters/`)
        if (!response.ok) {
            throw new Error(`HTTP error! Response status: ${response.status}`)
        } else {
            const data = await response.json()
            setTheaters(data)
        }
    } catch (error) {
        console.error('Fetching Theater error', error)
        setError('Theaters cannot be loaded. Please try again!')
    } finally {
        setLoading(false)
    }
  }

  useEffect(() => {
        getTheaterList()
        getCityList()
    }, [])

  // Create button
  const [theaterFormCreate, setTheaterFormCreate] = useState(
    { name: "", city: [], rows: "", columns: "" }
  )
  
  const handleChangeCreate = (event) => {
    const { name, value } = event.target
    setTheaterFormCreate(prev => ({ ...prev, [name]: value}))
  } 

  const handleCityChange = (event) => {
    const selected = event.target.value
    setTheaterFormCreate(prev => ({ ...prev, city: selected }))
  }
  
  const handleSubmitCreate = (event) => {
    event.preventDefault()
    fetchTheaterCreate()
  }

  // Fetch City data
  const [cities, setCities] = useState([])
  
  const getCityList = async () => {
    try {
        const response = await fetch(`${api_url}/locations/cities/`)
        if (!response.ok) {
            throw new Error(`HTTP error! Response status: ${response.status}`)
        } else {
            const data = await response.json()
            setCities(data)
        }
    } catch (error) {
        console.error('Fetching City error', error)
    }
  }

  // Fetch to create theater
  const fetchTheaterCreate = async () => {
    try {
      const response = await fetch(`${api_url}/locations/theaters/create/`, {
        method: 'POST', 
        headers : {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ 
            name: theaterFormCreate.name, 
            city: theaterFormCreate.city, 
            rows: theaterFormCreate.rows,
            columns: theaterFormCreate.columns
        })
      })
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Create theater failed:', errorData)
        alert('Create theater failed: ' + (errorData?.detail || response.status))
      } else {
        const data = await response.json()
        console.log(data)
        alert(`Theater "${theaterFormCreate.name}" created!`)
        await getTheaterList()
      }
    } catch (error) {
        console.error('Fetching Theater Create error', error)
        alert('Something went wrong while creating theater.')
    }
  }

  // Update button
  const [isUpdating, setIsUpdating] = useState(false)
  const [theaterId, setTheaterId] = useState("")
  const [theaterToUpdate, setTheaterToUpdate] = useState(null)
  const [updatedForm, setUpdatedForm] = useState(
    { name: "", rows: "", columns: "" }
  )

  // Show update tab
  const handleStartUpdate = (theater) => {
    setIsUpdating(true)
    setTheaterId(theater.id)
    setTheaterToUpdate(theater)
    setUpdatedForm({ name: theater.name, rows: theater.rows, columns: theater.columns })
  }

  const handleChangeUpdate = (event) => {
        const { name, value } = event.target
        setUpdatedForm(prev => ({ ...prev, [name]: value }))
    }

  // Submit update on update tab
  const handleSubmitUpdate = (event) => {
    event.preventDefault()
    fetchTheaterUpdate()
  }

  // Fetch to update genre
  const fetchTheaterUpdate = async () => {
    try {
      const response = await fetch(`${api_url}/locations/theaters/staff/${theaterId}/`, {
        method: 'PATCH', 
        headers : {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ name: updatedForm.name, rows: updatedForm.rows, columns: updatedForm.columns })
      })
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Update theater failed:', errorData)
        alert('Update theater failed: ' + (errorData?.detail || response.status))
      } else {
        const data = await response.json()
        console.log(data)
        alert(`Theater got updated!`)
        setIsUpdating(false)
        setTheaterToUpdate(null)
        setUpdatedForm("")
        await getTheaterList()
      }
    } catch (error) {
        console.error('Fetching Theater update error', error)
        alert('Something went wrong while updating theater.')
    }
  } 

  // Delete button
  const handleDelete = (theaterId) => {
    fetchTheaterDelete(theaterId)
  }

  const fetchTheaterDelete = async (theaterId) => {
    try {
      const response = await fetch(`${api_url}/locations/theaters/staff/${theaterId}/`, {
        method: 'DELETE', 
        headers : {'Authorization': `Bearer ${accessToken}`},
      })
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Delete Theater failed:', errorData)
        alert('Delete Theater failed: ' + (errorData?.detail || response.status))
      } else {
        console.log("Theater deleted successfully.")
        alert(`Theater got deleted!`)
        await getTheaterList()
      }
    } catch (error) {
        console.error('Fetching Theater delete error', error)
        alert('Something went wrong while deleting Theater.')
    }
  }

  return (
    <>
    <div style={{ backgroundColor: "#FF8C00" }}>
      <h3>TheaterManagement</h3>

      {/* Theater data */}
      <table style={{ border: "1px solid black", width: "100%" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid black" }}>ID</th>
            <th style={{ border: "1px solid black" }}>City</th>
            <th style={{ border: "1px solid black" }}>Name</th>
            <th style={{ border: "1px solid black" }}>Rows, Columns</th>
            <th style={{ border: "1px solid black" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading && (<tr><td>Theater list is loading...</td></tr>)}
          {error && (<tr><td>{error}</td></tr>)}
          {!loading && !error && theaters.length === 0 && (
            <tr><td>Currently there are no theaters to show.</td></tr>
          )}
          {!loading && !error && theaters.length > 0 && theaters.map(theater => (
            <tr key={theater.id}>
              <td style={{ border: "1px solid black" }}>{theater.id}</td>
              <td style={{ border: "1px solid black" }}>{theater.city.name}</td>
              <td style={{ border: "1px solid black" }}>{theater.name}</td>
              <td style={{ border: "1px solid black" }}>R: {theater.rows}, C: {theater.columns}</td>
              <td style={{ border: "1px solid black" }}>
                <button onClick={() => handleStartUpdate(theater)}>Update</button>
                <button onClick={() => handleDelete(theater.id)}>Delete</button>
               </td>
            </tr>
           ))}
        </tbody>
      </table>

    {/* Create theater */}
    <h4>Add Theater</h4>
      <form onSubmit={handleSubmitCreate}>
        <label>Name: </label>
        <input type="text" name="name" value={theaterFormCreate.name} onChange={handleChangeCreate} required /><br />
        <label>City: </label>
          <select name="city" value={theaterFormCreate.city} onChange={handleCityChange} required>
            <option value="" disabled>Select city</option>
              {cities.map(city => (
                <option key={city.id} value={city.name}>{city.name}</option>
              ))}
            </select><br />
        <label>Rows: </label>
        <input type="number" name="rows" value={theaterFormCreate.rows} onChange={handleChangeCreate} required /><br />
        <label>Columns: </label>
        <input type="number" name="columns" value={theaterFormCreate.columns} onChange={handleChangeCreate} required /><br />
        <button type="submit">Create Theater</button>
      </form>

    {/* Update theater */}
    {isUpdating && (
      <>
      <h4>Update City</h4>
      <form onSubmit={handleSubmitUpdate}>
        <label>New name for "{theaterToUpdate.name}" : </label>
        <input type="text" name="name" value={updatedForm.name} onChange={handleChangeUpdate} required /><br />
        <label>Rows: </label>
        <input type="number" name="rows" value={updatedForm.rows} onChange={handleChangeUpdate} required /><br />
        <label>Columns: </label>
        <input type="number" name="columns" value={updatedForm.columns} onChange={handleChangeUpdate} required /><br />
        <button type="submit">Update Theater</button>
      </form>
      </>
     )}
    </div>
    </>
  )
}

export default TheaterManagement
