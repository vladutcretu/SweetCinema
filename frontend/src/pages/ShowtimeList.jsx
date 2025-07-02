// React, dependencies & packages
import React, { useEffect, useState } from 'react'

// App
import { useCityContext } from '../contexts/CityContext'
import { Link } from 'react-router-dom'
const api_url = import.meta.env.VITE_API_URL

// Write components here


const ShowtimeList = () => {
  // Get city context to fetch with it
  const { selectedCityId, selectedCityName } = useCityContext()
  // Fetch Showtime data
  const [showtimes, setShowtimes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const getShowtimeList = async () => {
      try {
        const response = await fetch(`${api_url}/showtimes/?theater__city=${selectedCityId}`)
          if (!response.ok) {
            throw new Error(`HTTP error! Response status: ${response.status}`)
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

    getShowtimeList()
  }, [])
  
  return (
    <>
    <div>
      <h1>ShowtimeList for "{selectedCityName}" " </h1>
      <table style={{ border: "1px solid black", width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Movie</th>
            <th>Theater</th>
            <th>Price</th>
            <th>Date</th>
            <th>Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading && <p>Showtime list is loading</p>}
          {error && <p>{error}</p>}
          {!loading && !error && showtimes.length === 0 && (<p>Currently there's no showtimes to show.</p>)}
          {!loading && !error && showtimes.length > 0 && showtimes.map(showtime => (
            <tr key={showtime.id}>
              <td>{showtime.id}</td>
              <td>{showtime.movie.title}</td>
              <td>{showtime.theater.name}</td>
              <td>{showtime.price}</td>
              <td>{showtime.date}</td>
              <td>{showtime.time}</td>
              <td><Link to={`/showtime/${showtime.id}/`}>Go to showtime page</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  )
}

export default ShowtimeList
