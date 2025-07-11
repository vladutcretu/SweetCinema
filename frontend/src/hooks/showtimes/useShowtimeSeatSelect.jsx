// React, depedencies & packages
import { useState } from "react"

// Components here


export const useShowtimeSeatSelect = () => {
  const [selectedSeats, setSelectedSeats] = useState([])

  const toggleSeat = (seat) => {
    setSelectedSeats(prev => {
      const exists = prev.find(s => s.id === seat.id)
      if (exists) {
        return prev.filter(s => s.id !== seat.id)
      } else {
        return [...prev, { id: seat.id, row: seat.row, column: seat.column }]
      }
    })
  }

  const selectedSeatIds = selectedSeats.filter(s => typeof s.id === "number").map(s => s.id)

  return { selectedSeats, toggleSeat, selectedSeatIds, setSelectedSeats }
}