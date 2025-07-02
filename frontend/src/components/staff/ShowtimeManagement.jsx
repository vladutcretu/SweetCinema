// React, dependencies & packages
import React, { useState, useEffect } from 'react'

// App
import { useAuthContext } from '../../contexts/AuthContext'
const api_url = import.meta.env.VITE_API_URL

// Write components here


const ShowtimeManagement = () => {
  // Get context for access
  const { accessToken } = useAuthContext()

  // Fetch Showtime data
  const [showtimes, setShowtimes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const getShowtimeList = async () => {
    try {
      const response = await fetch(`${api_url}/showtimes/staff/`, {
        method: 'GET', 
        headers : {'Authorization': `Bearer ${accessToken}`},
      })
      if (!response.ok) {
        throw new Error (`HTTP error! Response status: ${response.status}`)
      } else {
          const data = await response.json()
          console.log(data)
          setShowtimes(data)
      }
    } catch (error) {
      console.error('Fetching Showtime error', error)
      setError('Showtimes cannot be loaded. Please try again!')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getShowtimeList()
    getMovieList()
    getTheaterList()
  }, [])


  // // Create Showtime button
  const [showtimeFormCreate, setShowtimeFormCreate] = useState(
    { movie: "", theater: "", price: "", starts_at: "" }
    )
    
    const handleChangeCreate = (event) => {
      const { name, value } = event.target
      setShowtimeFormCreate(prev => ({ ...prev, [name]: value}))
    } 
  
    const handleMovieChange = (event) => {
      const selected = event.target.value
      setShowtimeFormCreate(prev => ({ ...prev, movie: selected }))
    }

    const handleTheaterChange = (event) => {
      const selected = event.target.value
      setShowtimeFormCreate(prev => ({ ...prev, theater: selected }))
    }

    const handleSubmitCreate = (event) => {
      event.preventDefault()
      fetchShowtimeCreate()
    }

  // Fetch Movie data to insert in select options
  const [movies, setMovies] = useState([])

  const getMovieList = async () => {
    try {
      const response = await fetch(`${api_url}/movies/`)
      if (!response.ok) {
        throw new Error (`HTTP error! Response status: ${response.status}`)
      } else {
        const data = await response.json()
        console.log(data)
        setMovies(data)
      }
    } catch (error) {
      console.error('Fetching Movie error', error)
    } 
  }  

  // Fetch Theater data to insert in select options
  const [theaters, setTheaters] = useState([])

  const getTheaterList = async () => {
    try {
      const response = await fetch(`${api_url}/locations/theaters/`)
      if (!response.ok) {
        throw new Error (`HTTP error! Response status: ${response.status}`)
      } else {
        const data = await response.json()
        console.log(data)
        setTheaters(data)
      }
    } catch (error) {
      console.error('Fetching Theater error', error)
    } 
  } 

  // Fetch to create Showtime
  const fetchShowtimeCreate = async () => {
    try {
      const response = await fetch(`${api_url}/showtimes/staff/create/`, {
        method: 'POST', 
        headers : {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ 
          movie: showtimeFormCreate.movie, 
          theater: showtimeFormCreate.theater, 
          price: showtimeFormCreate.price, 
          starts_at: showtimeFormCreate.starts_at
        })
      })
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Create Showtime failed:', errorData)
        alert('Create Showtime failed: ' + (errorData?.detail || response.status))
      } else {
        const data = await response.json()
        console.log(data)
        alert(`Showtime created!`)
        setShowtimeFormCreate({ movie: "", theater: "", price: "", starts_at: "" })
        await getShowtimeList()
      }
    } catch (error) {
        console.error('Fetching Showtime Create error', error)
        alert('Something went wrong while creating Showtime.')
    }
  }

  // Update button
  const [isUpdating, setIsUpdating] = useState(false)
  const [showtimeId, setShowtimeId] = useState("")
  const [showtimeToUpdate, setShowtimeToUpdate] = useState(null)
  const [updatedForm, setUpdatedForm] = useState(
    { price: "", starts_at: "" }
  )

  // Show update tab
  const handleStartUpdate = (showtime) => {
    setIsUpdating(true)
    setShowtimeId(showtime.id)
    setShowtimeToUpdate(showtime)
    setUpdatedForm({ price: showtime.price, starts_at: showtime.starts_at })
  }

  const handleChangeUpdate = (event) => {
        const { name, value } = event.target
        setUpdatedForm(prev => ({ ...prev, [name]: value }))
    }

  // Submit update on update tab
  const handleSubmitUpdate = (event) => {
    event.preventDefault()
    fetchShowtimeUpdate()
  }

  // Fetch to update genre
  const fetchShowtimeUpdate = async () => {
    try {
      const response = await fetch(`${api_url}/showtimes/staff/${showtimeId}/`, {
        method: 'PATCH', 
        headers : {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ price: updatedForm.price, starts_at: updatedForm.starts_at })
      })
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Update Showtime failed:', errorData)
        alert('Update Showtime failed: ' + (errorData?.detail || response.status))
      } else {
        const data = await response.json()
        console.log(data)
        alert(`Showtime got updated!`)
        setIsUpdating(false)
        setShowtimeToUpdate(null)
        setUpdatedForm("")
        await getShowtimeList()
      }
    } catch (error) {
        console.error('Fetching Showtime update error', error)
        alert('Something went wrong while updating Showtime.')
    }
  } 

  // Delete button
  const handleDelete = (showtimeId) => {
    fetchShowtimeDelete(showtimeId)
  }

  const fetchShowtimeDelete = async (showtimeId) => {
    try {
      const response = await fetch(`${api_url}/showtimes/staff/${showtimeId}/`, {
        method: 'DELETE', 
        headers : {'Authorization': `Bearer ${accessToken}`},
      })
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Delete showtime failed:', errorData)
        alert('Delete showtime failed: ' + (errorData?.detail || response.status))
      } else {
        console.log("Showtime deleted successfully.")
        alert(`Showtime got deleted!`)
        await getShowtimeList()
      }
    } catch (error) {
        console.error('Fetching Showtime delete error', error)
        alert('Something went wrong while deleting showtime.')
    }
  }


  return (
    <>
    <div style={{ backgroundColor: "#556B2F" }}>
      <h3>ShowtimeManagement</h3>

      <table style={{ border: "1px solid black", width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Movie</th>
            <th>Theater, City</th>
            <th>Price</th>
            <th>Date/Time</th>
            <th>Actions</th>
        </tr>
        </thead>
        <tbody>
          {loading && (<tr><td>Showtime list is loading...</td></tr>)}
          {error && (<tr><td>{error}</td></tr>)}
          {!loading && !error && showtimes.length === 0 && (
            <tr><td>Currently there are no showtimes to show.</td></tr>
          )}
          {!loading && !error && showtimes.length > 0 && showtimes.map(showtime => (
            <tr key={showtime.id}>
              <td>{showtime.id}</td>
              <td>{showtime.movie.title}</td>
              <td>{showtime.theater.name}, {showtime.theater.city.name}</td>
              <td>{showtime.price}</td>
              <td>{showtime.starts_at}</td>
              <td>
                <button onClick={() => handleStartUpdate(showtime)}>Update</button>
                <button onClick={() => handleDelete(showtime.id)}>Delete</button>
              </td>
            </tr>
            ))}
        </tbody>
      </table>

      {/* Create Showtime */}
      <h4>Create showtime</h4>
      <form onSubmit={handleSubmitCreate}>
        <label>Movie: </label>
          <select type="text" name="movie" value={showtimeFormCreate.movie} onChange={handleMovieChange} required>
            <option value="" disabled>Select movie</option>
              {movies.map((movie) => (<option key={movie.id} value={movie.id}>{movie.title}</option>))}
          </select><br />
          <label>Theater: </label>
          <select type="text" name="theater" value={showtimeFormCreate.theater} onChange={handleTheaterChange} required>
            <option value="" disabled>Select theater</option>
              {theaters.map((theater) => (<option key={theater.id} value={theater.id}>{theater.name}, {theater.city.name}</option>))}
          </select><br />
          <label>Price: </label>
          <input type="number" name="price" value={showtimeFormCreate.price} onChange={handleChangeCreate} required /><br />
          <label>Starts at: </label>
          <input type="datetime-local" name="date" value={showtimeFormCreate.starts_at} onChange={handleChangeCreate} required /><br />
          <button>Add Showtime</button>
        </form>

        {/* Update Showtime */}
        {isUpdating && (
          <>
          <h4>Update Showtime "{showtimeToUpdate.movie.title}" from "{showtimeToUpdate.theater.name}, {showtimeToUpdate.theater.city.name}"</h4>
          <form onSubmit={handleSubmitUpdate}>
            <label>Price: </label>
            <input type="number" name="price" value={updatedForm.price} onChange={handleChangeUpdate} required /><br />
            <label>Start at: </label>
            <input type="datetime-local" name="date" value={updatedForm.starts_at} onChange={handleChangeUpdate} required /><br />
            <button>Update Showtime</button>
          </form>
          </>
        )}
    </div>
    </>
  )
}

export default ShowtimeManagement
