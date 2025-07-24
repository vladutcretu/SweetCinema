// React, depedencies & packages
import { useNavigate } from "react-router-dom"

// UI
import { Box, Button, Spinner, Text } from "@chakra-ui/react"

// App
import { useCreateBookingReserve } from "@/hooks/tickets/useCreateBookingReserve"
import { useCreateBookingPurchase } from "@/hooks/tickets/useCreateBookingPurchase"

// Components here


const ShowtimeTicket = ({ showtimeId, seatIds, allowed, onSuccess }) => {
  const { createBookingReserve, loading: loadingReserve, error: errorReserve } = useCreateBookingReserve()
  const { createBookingPurchase, loading: loadingPurchase, error: errorPurchase } = useCreateBookingPurchase()
  const navigate = useNavigate()

  const handleTicketReserve = async () => {
    const result = await createBookingReserve(showtimeId, seatIds, "reserved")
    if (result) {
      alert("✅ Seats reserved successfully!")
      if (onSuccess) onSuccess()
    } else {
      alert("❌ Seats reserving unsuccessfully!")
    }
  }

  const handleTicketPurchase = async () => {
    const result = await createBookingPurchase(showtimeId, seatIds, "pending_payment")
    if (result) {
      alert("✅ Seats temporarely reserved successfully! Complete payment to purchase seats!")
      navigate(`/payment/`, { state: { bookingIds: result.booking_ids, seatsNumber: result.booking_ids.length }})
    } else {
      alert("❌ Seats purchasing unsuccessfully!")
    }
  }

  if (errorReserve) return <Text>{errorReserve}</Text>
  if (errorPurchase) return <Text>{errorPurchase}</Text>

  return (
    <Box mt={5}>
      <Button
        disabled={loadingReserve || seatIds.length === 0 || !allowed}
        onClick={handleTicketReserve}
        colorScheme="teal"
        variant="outline"
        size="sm"
        >
          {loadingReserve ? <Spinner size="sm" mr={2} /> : "Reserve tickets"}
      </Button>
      <Button
        disabled={loadingReserve || seatIds.length === 0}
        onClick={handleTicketPurchase}
        colorScheme="teal"
        variant="outline"
        size="sm"
      >
        {loadingPurchase ? <Spinner size="sm" mr={2} /> : "Purchase tickets"}
      </Button>
    </Box>
  )
}
export default ShowtimeTicket