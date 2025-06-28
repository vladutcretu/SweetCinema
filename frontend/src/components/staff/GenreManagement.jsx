// React, dependencies & packages
import React, { useEffect, useState } from 'react'

// App
import { useAuthContext } from '../../contexts/AuthContext'
const api_url = import.meta.env.VITE_API_URL

// Write components here


const GenreManagement = () => {
  // Get context for access
  const { accessToken } = useAuthContext()

  // Fetch Genre data
  const [genres, setGenres] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const getGenreList = async () => {
    try {
      const response = await fetch(`${api_url}/movies/genres/`)
      if (!response.ok) {
        throw new Error (`HTTP error! Response status: ${response.status}`)
      } else {
          const data = await response.json()
          console.log(data)
          setGenres(data)
      }
    } catch (error) {
      console.error('Fetching Genre error', error)
      setError('Genres cannot be loaded. Please try again!')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getGenreList()
  }, [])
  
  // Create genre form & button
  const [genreNameCreate, setGenreNameCreate] = useState("")

  const handleChangeCreate = (event) => {
    setGenreNameCreate(event.target.value)
  }

  const handleSubmitCreate = (event) => {
    event.preventDefault()
    fetchGenreCreate()
    setGenreNameCreate("")
  }

  // Fetch to create genre
  const fetchGenreCreate = async () => {
    try {
      const response = await fetch(`${api_url}/movies/genres/create/`, {
        method: 'POST', 
        headers : {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ name: genreNameCreate })
      })
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Create genre failed:', errorData)
        alert('Create failed: ' + (errorData?.detail || response.status))
      } else {
        const data = await response.json()
        console.log(data)
        alert(`Genre "${genreNameCreate}" created!`)
        await getGenreList()
      }
    } catch (error) {
        console.error('Fetching Genre Create error', error)
        alert('Something went wrong while creating genre.')
    }
  }

  // Update button
  const [isUpdating, setIsUpdating] = useState(false)
  const [genreId, setGenreId] = useState("")
  const [genreToUpdate, setGenreToUpdate] = useState(null)
  const [updatedName, setUpdatedName] = useState("")

  // Show update tab
  const handleStartUpdate = (genre) => {
    setIsUpdating(true)
    setGenreId(genre.id)
    setGenreToUpdate(genre)
    setUpdatedName(genre.name)
  }

  // Submit update on update tab
  const handleSubmitUpdate = (event) => {
    event.preventDefault()
    fetchGenreUpdate()
  }

  // Fetch to update genre
    const fetchGenreUpdate = async () => {
    try {
      const response = await fetch(`${api_url}/movies/genres/${genreId}/`, {
        method: 'PUT', 
        headers : {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ name: updatedName })
      })
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Create genre failed:', errorData)
        alert('Update failed: ' + (errorData?.detail || response.status))
      } else {
        const data = await response.json()
        console.log(data)
        alert(`Genre got updated to "${updatedName}"!`)
        setIsUpdating(false)
        setGenreToUpdate(null)
        setUpdatedName("")
        await getGenreList()
      }
    } catch (error) {
        console.error('Fetching Genre update error', error)
        alert('Something went wrong while updating genre.')
    }
  }

  // Delete button
  const handleDelete = (genreId) => {
    fetchGenreDelete(genreId)
  }

  const fetchGenreDelete = async (genreId) => {
    try {
      const response = await fetch(`${api_url}/movies/genres/${genreId}/`, {
        method: 'DELETE', 
        headers : {'Authorization': `Bearer ${accessToken}`},
      })
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Create genre failed:', errorData)
        alert('Update failed: ' + (errorData?.detail || response.status))
      } else {
        console.log("Genre deleted successfully.")
        alert(`Genre got deleted!`)
        await getGenreList()
      }
    } catch (error) {
        console.error('Fetching Genre delete error', error)
        alert('Something went wrong while deleting genre.')
    }
  }


  return (
    <>
    <div style={{ backgroundColor: "#B8860B" }}>
      <h3>GenreManagement</h3>

      {/* Genre data*/}
      <table style={{ border: "1px solid black", width: "100%" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid black" }}>ID</th>
            <th style={{ border: "1px solid black" }}>Name</th>
            <th style={{ border: "1px solid black" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading && (<tr><td>Genre list is loading...</td></tr>)}
          {error && (<tr><td>{error}</td></tr>)}
          {!loading && !error && genres.length === 0 && (
            <tr><td>Currently there are no genres to show.</td></tr>
          )}
          {!loading && !error && genres.length > 0 && genres.map(genre => (
            <tr key={genre.id}>
              <td style={{ border: "1px solid black" }}>{genre.id}</td>
              <td style={{ border: "1px solid black" }}>{genre.name}</td>
              {/* Update & Delete buttons */}
              <td>
                  <button onClick={() => handleStartUpdate(genre)}>Update</button>
                  <button onClick={() => handleDelete(genre.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Create genre */}
      <h4>Add Genre</h4>
      <form onSubmit={handleSubmitCreate}>
        <label>Name:</label>
        <input type="text" value={genreNameCreate} onChange={handleChangeCreate} required></input>
        <button type="submit">Create Genre</button>
      </form>

      {/* Update gengre */}
      {isUpdating && (
        <>
        <h4>Update Genre</h4>
        <form onSubmit={handleSubmitUpdate}>
            <label>New name for Genre "{genreToUpdate.name}": </label>
            <input type="text" value={updatedName} onChange={(event) => setUpdatedName(event.target.value)} required /><br />
            <button type="submit">Update Genre</button>
        </form>
        </>
      )}
    </div>
    </>
  )
}

export default GenreManagement
