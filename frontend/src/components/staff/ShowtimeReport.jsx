// React, dependencies & packages
import React, { useEffect, useState } from "react"

// App
import { useAuthContext } from "../../contexts/AuthContext"
const api_url = import.meta.env.VITE_API_URL

// Write components here


const ShowtimeReportDashboard = () => {
  const { accessToken } = useAuthContext()

  const [showtimes, setShowtimes] = useState([])
  const [selectedShowtimeId, setSelectedShowtimeId] = useState(null)
  const [error, setError] = useState(null)

  const [report, setReport] = useState(null)
  const [loadingShowtimes, setLoadingShowtimes] = useState(true)
  const [loadingReport, setLoadingReport] = useState(false)

  // Fetch all showtimes
  useEffect(() => {
    const fetchShowtimes = async () => {
      try {
        const response = await fetch(`${api_url}/showtimes/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        if (!response.ok) throw new Error(`HTTP error ${response.status}`)
        const data = await response.json()
        setShowtimes(data)
      } catch (err) {
        console.error("Failed to fetch showtimes:", err)
        setError("Could not load showtimes.")
      } finally {
        setLoadingShowtimes(false)
      }
    }

    if (accessToken) fetchShowtimes()
  }, [accessToken])

  // Fetch report for selected showtime
  useEffect(() => {
    const fetchReport = async () => {
      if (!selectedShowtimeId) return

      setLoadingReport(true)
      setError(null)

      try {
        const response = await fetch(`${api_url}/showtimes/${selectedShowtimeId}/report/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        if (!response.ok) throw new Error(`HTTP error ${response.status}`)
        const data = await response.json()
        setReport(data)
      } catch (err) {
        console.error("Failed to fetch report:", err)
        setError("Could not load report.")
      } finally {
        setLoadingReport(false)
      }
    }

    fetchReport()
  }, [selectedShowtimeId, accessToken])

  return (
    <div style={{ backgroundColor: "#556B6F", padding: "1rem" }}>
      <h2>Showtime Reports Dashboard</h2>

      {/* Dropdown for showtime selection */}
      <div style={{ marginBottom: "1rem" }}>
        <label>Select a showtime: </label>
        {loadingShowtimes ? (
          <p>Loading showtimes...</p>
        ) : (
          <select
            value={selectedShowtimeId || ""}
            onChange={(e) => setSelectedShowtimeId(e.target.value)}
          >
            <option value="">-- Choose --</option>
            {showtimes.map((st) => (
              <option key={st.id} value={st.id}>
                {st.movie.title} | {st.theater.name} | {st.starts_at}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Report display */}
      {loadingReport && <p>Loading report...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {report && (
        <div style={{ backgroundColor: "#556B4C", border: "1px solid #ccc", padding: "1rem" }}>
          <h3>Analytics Report</h3>
          <p><strong>Movie:</strong> {report.movie}</p>
          <p><strong>Theater:</strong> {report.theater}</p>
          <p><strong>City:</strong> {report.city}</p>
          <p><strong>Starts_at:</strong> {report.starts_at}</p>
          <p><strong>Tickets Sold:</strong> {report.tickets_sold}</p>
          <p><strong>Total Revenue:</strong> {report.total_revenue}</p>
          <p><strong>Occupancy:</strong> {report.occupancy_percentage}%</p>
        </div>
      )}
    </div>
  )
}

export default ShowtimeReportDashboard
