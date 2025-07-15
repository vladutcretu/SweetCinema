// React, depedencies & packages
import { useNavigate } from "react-router-dom"

// UI
import { Box, Button, Spinner, Text } from "@chakra-ui/react"

// App
import { usePostTicketReserve } from "@/hooks/tickets/usePostTicketReserve"
import { usePostTicketPurchase } from "@/hooks/tickets/usePostTicketPurchase"

// Components here


const ShowtimeTicket = ({ showtimeId, seatIds, allowed, onSuccess }) => {
  const { postTicketReserve, loading: loadingReserve, error: errorReserve } = usePostTicketReserve()
  const { postTicketPurchase, loading: loadingPurchase, error: errorPurchase } = usePostTicketPurchase()
  const navigate = useNavigate()

  const handleTicketReserve = async () => {
    const result = await postTicketReserve(showtimeId, seatIds)
    if (result) {
      alert("✅ Seats reserved successfully!")
      if (onSuccess) onSuccess()
    } else {
      alert("❌ Seats reserving unsuccessfully!")
    }
  }

  const handleTicketPurchase = async () => {
    const result = await postTicketPurchase(showtimeId, seatIds)
    if (result) {
      alert("✅ Seats temporarely reserved successfully! Complete payment to purchase seats!")
      navigate(`/payment/`, { state: { bookingIds: result.booking_ids, seatsNumber: result.booking_ids.length }})
    } else {
      alert("❌ Seats purchasing unsuccessfully!")
    }
  }

  if (errorReserve) {
    return <Text>{errorReserve}</Text>
  }

  if (errorPurchase) {
    return <Text>{errorReserve}</Text>
  }

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