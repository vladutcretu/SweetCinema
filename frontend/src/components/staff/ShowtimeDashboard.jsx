// React, dependencies & packages
import React, { useEffect, useState } from "react"

// App
import { useAuthContext } from "../../contexts/AuthContext"
import TicketPay from "../TicketPay"
const api_url = import.meta.env.VITE_API_URL

// Write components here:


const ShowtimeSeatManager = () => {
  const { accessToken, user, isAuthenticated } = useAuthContext()

  // Fetch showtimes
  const [showtimes, setShowtimes] = useState([])
  const [loadingShowtimes, setLoadingShowtimes] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const getShowtimeList = async () => {
      try {
        const response = await fetch(`${api_url}/showtimes/?theater__city=${user?.city}`)
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
        const data = await response.json()
        setShowtimes(data)
      } catch (err) {
        console.error("Error fetching showtimes:", err)
        setError("Couldn't load showtimes.")
      } finally {
        setLoadingShowtimes(false)
      }
    }

    if (user?.city) getShowtimeList()
  }, [user?.city])

  // Fetch seats for selected showtime
  const [selectedShowtimeId, setSelectedShowtimeId] = useState(null)
  const [seats, setSeats] = useState([])
  const [loadingSeats, setLoadingSeats] = useState(false)
  const [selectedSeats, setSelectedSeats] = useState([])

  useEffect(() => {
    const getSeats = async () => {
      if (!selectedShowtimeId) return
      setLoadingSeats(true)
      try {
        const response = await fetch(`${api_url}/showtimes/${selectedShowtimeId}/seats/`)
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
        const data = await response.json()
        setSeats(data)
      } catch (err) {
        console.error("Error fetching seats:", err)
        setError("Couldn't load seats.")
      } finally {
        setLoadingSeats(false)
      }
    }

    getSeats()
    setSelectedSeats([])
  }, [selectedShowtimeId])

  const toggleSeat = (seatId) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((id) => id !== seatId) : [...prev, seatId]
    )
  }

  const statusColors = {
    available: "lightgreen",
    reserved: "lightblue",
    purchased: "lightcoral",
  }

  return (
    <div style={{ backgroundColor: "#483D6D", padding: "1rem", color: "white" }}>
      <h2>Manage Showtimes & Seats</h2>

      <div style={{ marginBottom: "1rem" }}>
        <label>Select a showtime: </label>
        {loadingShowtimes ? (
          <p>Loading showtimes...</p>
        ) : (
          <select
            value={selectedShowtimeId || ""}
            onChange={(e) => setSelectedShowtimeId(e.target.value)}
          >
            <option value="">-- Choose a showtime --</option>
            {showtimes.map((st) => (
              <option key={st.id} value={st.id}>
                {st.movie.title} | {st.theater.name} | {st.starts_at}
              </option>
            ))}
          </select>
        )}
      </div>

      {selectedShowtimeId && (
        <>
          {loadingSeats ? (
            <p>Loading seats...</p>
          ) : (
            <div>
              <h3>Seats for Showtime ID {selectedShowtimeId}</h3>
              {seats.length === 0 ? (
                <p>No seats found for this showtime.</p>
              ) : (
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                  {seats.map((seat) => (
                    <div
                      key={seat.id}
                      style={{
                        backgroundColor: statusColors[seat.status] || "gray",
                        padding: "10px",
                        margin: "5px",
                        borderRadius: "5px",
                        minWidth: "150px",
                      }}
                    >
                      <p>
                        Seat {seat.id} — R{seat.row} C{seat.column}
                      </p>
                      <p>Status: {seat.status}</p>
                      {seat.status === "available" && (
                        <label>
                          <input
                            type="checkbox"
                            checked={selectedSeats.includes(seat.id)}
                            onChange={() => toggleSeat(seat.id)}
                          />
                          Select
                        </label>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
                <div style={{ marginTop: "20px" }}>
                  <TicketPay showtimeId={selectedShowtimeId} seatIds={selectedSeats} />
                </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ShowtimeSeatManager
