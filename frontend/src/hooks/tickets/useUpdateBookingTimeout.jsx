// React, depedencies & packages
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

// App
import { bookingService } from "@/services/tickets/bookingService"

// Components here


export const updateBookingTimeout = (bookingIds, durationInSeconds = 60) => {
  const [secondsLeft, setSecondsLeft] = useState(durationInSeconds)
  const navigate = useNavigate()

  useEffect(() => {
    if (secondsLeft <= 0) return

    const interval = setInterval(() => {
      setSecondsLeft(prev => prev - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [secondsLeft])

  useEffect(() => {
    if (secondsLeft !== 0) return

    const updateBookingTimeout = async () => {
      try {
        const response = await bookingService.updateBookingTimeout(bookingIds)
        alert("⏱️ You did not complete the payment. Please try again!")
        console.log("Put Payment Timeout successful:", response)
        navigate('/')
      } catch (error) {
        alert("❌ An error occurred while updating your booking since your time passed.")
        console.error("Put Payment Timeout unsuccessful:", error)
      }
    }

    updateBookingTimeout()
  }, [secondsLeft, bookingIds])

  const formattedTime = `${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, '0')}`

  return { secondsLeft, formattedTime }
}