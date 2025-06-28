// React, dependencies & packages
import React, { useState, useEffect } from 'react'

// App
import { useAuthContext } from '../../contexts/AuthContext'
const api_url = import.meta.env.VITE_API_URL

// Write components here


const CityManagement = () => {
  // Get context for access
  const { accessToken } = useAuthContext()

  // Fetch City data
  const [cities, setCities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
        setError('Cities cannot be loaded. Please try again!')
    } finally {
        setLoading(false)
    }
  }

  useEffect(() => {
        getCityList()
    }, [])

  // Create city
  const [cityNameCreate, setCityNameCreate] = useState("")

  const handleChangeCreate = (event) => {
    setCityNameCreate(event.target.value)
  } 

  const handleSubmitCreate = (event) => {
    event.preventDefault() 
    fetchCityCreate()
    setCityNameCreate("")
  }

  // Fetch to create city
  const fetchCityCreate = async () => {
    try {
      const response = await fetch(`${api_url}/locations/cities/create/`, {
        method: 'POST', 
        headers : {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ name: cityNameCreate })
      })
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Create City failed:', errorData)
        alert('Create City failed: ' + (errorData?.detail || response.status))
      } else {
        const data = await response.json()
        console.log(data)
        alert(`City "${cityNameCreate}" created!`)
        await getCityList()
      }
    } catch (error) {
        console.error('Fetching City Create error', error)
        alert('Something went wrong while creating City.')
    }
  }

  // Update button
  const [isUpdating, setIsUpdating] = useState(false)
  const [cityId, setCityId] = useState("")
  const [cityToUpdate, setCityToUpdate] = useState(null)
  const [updatedCity, setUpdatedCity] = useState("")

  // Show update tab
  const handleStartUpdate = (city) => {
    setIsUpdating(true)
    setCityId(city.id)
    setCityToUpdate(city)
    setUpdatedCity(city.name)
    }

    const handleUpdateChange = (event) => {
        setUpdatedCity(event.target.value)
    }

  // Submit update on update tab
  const handleSubmitUpdate = (event) => {
      event.preventDefault()
      fetchCityUpdate()
  }

  // Fetch to update city
  const fetchCityUpdate = async () => {
    try {
      const response = await fetch(`${api_url}/locations/cities/${cityId}/`, {
        method: 'PUT', 
        headers : {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ name: updatedCity })
      })
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Update city failed:', errorData)
        alert('Update city failed: ' + (errorData?.detail || response.status))
      } else {
        const data = await response.json()
        console.log(data)
        alert(`City got updated to "${updatedCity}"!`)
        setIsUpdating(false)
        setCityToUpdate(null)
        setUpdatedCity("")
        await getCityList()
      }
    } catch (error) {
        console.error('Fetching City update error', error)
        alert('Something went wrong while updating city.')
    }
  }

  // Delete button
  const handleDelete = (cityId) => {
    fetchCityDelete(cityId)
  }

  const fetchCityDelete = async (cityId) => {
    try {
      const response = await fetch(`${api_url}/locations/cities/${cityId}/`, {
        method: 'DELETE', 
        headers : {'Authorization': `Bearer ${accessToken}`},
      })
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Delete city failed:', errorData)
        alert('Delete city failed: ' + (errorData?.detail || response.status))
      } else {
        console.log("City deleted successfully.")
        alert(`City got deleted!`)
        await getCityList()
      }
    } catch (error) {
        console.error('Fetching City delete error', error)
        alert('Something went wrong while deleting city.')
    }
  }


  return (
    <>
    <div style={{ backgroundColor: "#556B2F" }}>
      <h3>CityManagement</h3>

      <table style={{ border: "1px solid black", width: "100%" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid black" }}>ID</th>
            <th style={{ border: "1px solid black" }}>Name</th>
            <th style={{ border: "1px solid black" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading && (<tr><td>City list is loading...</td></tr>)}
          {error && (<tr><td>{error}</td></tr>)}
          {!loading && !error && cities.length === 0 && (
            <tr><td>Currently there are no cities to show.</td></tr>
          )}
          {!loading && !error && cities.length > 0 && cities.map(city => (
            <tr key={city.id}>
              <td style={{ border: "1px solid black" }}>{city.id}</td>
              <td style={{ border: "1px solid black" }}>{city.name}</td>
              <td style={{ border: "1px solid black" }}>
                <button onClick={() => handleStartUpdate(city)}>Update</button>
                <button onClick={() => handleDelete(city.id)}>Delete</button>
               </td>
            </tr>
           ))}
        </tbody>
      </table>
    
    {/* Create city */}
    <h4>Add City</h4>
      <form onSubmit={handleSubmitCreate}>
        <label>Name: </label>
        <input type="text" value={cityNameCreate} onChange={handleChangeCreate} required /><br />
        <button type="submit">Create City</button>
      </form>
    </div>

    {/* Update city */}
    {isUpdating && (
      <>
      <h4>Update City</h4>
        <form onSubmit={handleSubmitUpdate}>
            <label>New name for "{cityToUpdate.name}": </label>
            <input type="text" value={updatedCity} onChange={handleUpdateChange} required /><br />
            <button type="submit">Update City</button>
        </form>
      </>
    )}
    </>
  )
}

export default CityManagement
