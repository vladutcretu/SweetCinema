// React, dependencies & packages
import React, { useState, useEffect } from 'react'

// App
import { useAuthContext } from '../../contexts/AuthContext'
const api_url = import.meta.env.VITE_API_URL

// Write components here


const MovieManagement = () => {
  // Get context for access
  const { accessToken } = useAuthContext()

  // Fetch Movie data
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
      setError('Movies cannot be loaded. Please try again!')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getMovieList()
    getGenreList()
  }, [])

  // Create Movie form & button
  const [movieCreateForm, setMovieCreateForm] = useState(
    { title: "", description: "", genres: [] }
  )

  const handleChangeCreate = (event) => {
    const { name, value } = event.target
    setMovieCreateForm(prev => ({ ...prev, [name]: value}))
  }

  const handleGenreChange = (event) => {
    const selected = Array.from(event.target.selectedOptions, option => option.value)
    setMovieCreateForm(prev => ({ ...prev, genres: selected }))
  }


  const handleSubmitCreate = (event) => {
    event.preventDefault()
    fetchMovieCreate()
  }

  // Fetch Genre data to insert in select options
  const [genres, setGenres] = useState([])

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
    } 
  }

  // Fetch to create movie
  const fetchMovieCreate = async () => {
    try {
      const response = await fetch(`${api_url}/movies/create/`, {
        method: 'POST', 
        headers : {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ title: movieCreateForm.title, description: movieCreateForm.description, genres: movieCreateForm.genres })
      })
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Create movie failed:', errorData)
        alert('Create movie failed: ' + (errorData?.detail || response.status))
      } else {
        const data = await response.json()
        console.log(data)
        alert(`Movie "${movieCreateForm.title}" created!`)
        await getMovieList()
      }
    } catch (error) {
        console.error('Fetching Movie Create error', error)
        alert('Something went wrong while creating movie.')
    }
  }

  // Update button
  const [isUpdating, setIsUpdating] = useState(false)
  const [movieId, setMovieId] = useState("")
  const [movieToUpdate, setMovieToUpdate] = useState(null)
  const [updatedForm, setUpdatedForm] = useState(
    { title: "", description: "", genres: [] }
  )

  // Show update tab
  const handleStartUpdate = (movie) => {
    setIsUpdating(true)
    setMovieId(movie.id)
    setMovieToUpdate(movie)
    setUpdatedForm({ title: movie.title, description: movie.description, genres: movie.genres })
  }

  const handleChangeUpdate = (event) => {
        const { name, value } = event.target
        setUpdatedForm(prev => ({ ...prev, [name]: value }))
    }

  // Submit update on update tab
  const handleSubmitUpdate = (event) => {
    event.preventDefault()
    fetchMovieUpdate()
  }

  // Fetch to update genre
  const fetchMovieUpdate = async () => {
    try {
      const response = await fetch(`${api_url}/movies/movie/${movieId}/`, {
        method: 'PATCH', 
        headers : {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ title: updatedForm.title, description: updatedForm.description, genres: updatedForm.genres })
      })
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Update movie failed:', errorData)
        alert('Update movie failed: ' + (errorData?.detail || response.status))
      } else {
        const data = await response.json()
        console.log(data)
        alert(`Movie got updated!`)
        setIsUpdating(false)
        setMovieToUpdate(null)
        setUpdatedForm("")
        await getMovieList()
      }
    } catch (error) {
        console.error('Fetching Movie update error', error)
        alert('Something went wrong while updating movie.')
    }
  } 

  // Delete button
  const handleDelete = (movieId) => {
    fetchMovieDelete(movieId)
  }

  const fetchMovieDelete = async (movieId) => {
    try {
      const response = await fetch(`${api_url}/movies/movie/${movieId}/`, {
        method: 'DELETE', 
        headers : {'Authorization': `Bearer ${accessToken}`},
      })
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Delete movie failed:', errorData)
        alert('Delete movie failed: ' + (errorData?.detail || response.status))
      } else {
        console.log("Movie deleted successfully.")
        alert(`Movie got deleted!`)
        await getMovieList()
      }
    } catch (error) {
        console.error('Fetching Movie delete error', error)
        alert('Something went wrong while deleting movie.')
    }
  }


  return (
    <>
    <div style={{ backgroundColor: "#B4360B" }}>
      <h3>MovieManagement</h3>
      
      {/* Movie data*/}
      <table style={{ border: "1px solid black", width: "100%" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid black" }}>ID</th>
            <th style={{ border: "1px solid black" }}>Title</th>
            <th style={{ border: "1px solid black" }}>Description</th>
            <th style={{ border: "1px solid black" }}>Genres</th>
            {/* <th style={{ border: "1px solid black" }}>Poster</th> */}
            <th style={{ border: "1px solid black" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading && (<tr><td>Movie list is loading...</td></tr>)}
          {error && (<tr><td>{error}</td></tr>)}
          {!loading && !error && movies.length === 0 && (
            <tr><td>Currently there are no movies to show.</td></tr>
          )}
          {!loading && !error && movies.length > 0 && movies.map(movie => (
            <tr key={movie.id}>
              <td style={{ border: "1px solid black" }}>{movie.id}</td>
              <td style={{ border: "1px solid black" }}>{movie.title}</td>
              <td style={{ border: "1px solid black" }}>{movie.description}</td>
              <td style={{ border: "1px solid black" }}>{movie.genres.map(genre => genre.name).join(", ")}</td>
              {/* <td style={{ border: "1px solid black" }}>{movie.poster}</td> */}
              {/* Update & Delete buttons */}
              <td>
                  <button onClick={() => handleStartUpdate(movie)}>Update</button>
                  <button onClick={() => handleDelete(movie.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Create movie */}
      <h4>Movie Add</h4>
        <form onSubmit={handleSubmitCreate}>
          <label>Title: </label>
          <input name="title" value={movieCreateForm.title} onChange={handleChangeCreate} required></input><br />
          <label>Description: </label>
          <input name="description" value={movieCreateForm.description} onChange={handleChangeCreate} required></input><br />
          <label>Genre: </label>
            <select multiple value={movieCreateForm.genres} onChange={handleGenreChange} required>
              {genres.map(genre => (
                <option key={genre.id} value={genre.name}>{genre.name}</option>
              ))}
            </select><br />
            <button>Create Movie</button>
        </form>

      {/* Update movie */}
      {isUpdating && (
        <>
        <h4>Movie Update</h4>
          <form onSubmit={handleSubmitUpdate}>
            <label>New title for "{movieToUpdate.title}": </label>
            <input type="text" name="title" value={updatedForm.title} onChange={handleChangeUpdate} required /><br />
            <label>Description: </label>
            <input name="description" value={updatedForm.description} onChange={handleChangeUpdate} required /><br />
            <label>Genre: </label>
              <select multiple value={movieCreateForm.genres} onChange={handleGenreChange} required>
                {genres.map(genre => (
                  <option key={genre.id} value={genre.name}>{genre.name}</option>
               ))}
               </select>
            <button type="submit">Confirm Update</button>
          </form>
        </>
        )}
        
    </div>
    </>
  )
}

export default MovieManagement
