// React, dependencies & packages
import { useState } from "react"

// App
import { ticketService } from "@/services/tickets/ticketService"

// Components here


export const usePostTicketReserve = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const postTicketReserve = async (showtimeId, seatIds) => {
    setLoading(true)
    setError(null)
    setData(null)
    try {
      const response = await ticketService.postTicketReserve(showtimeId, seatIds)
      setData(response.data)
      console.log("Post Ticket Purchase successful:", response.data)
      return response.data
    } catch (error) {
      setError("Something went wrong while reserving the seats. Please try again.")
      console.error("Post Ticket Purchase failed:", error)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { postTicketReserve, loading, error, data }
}
