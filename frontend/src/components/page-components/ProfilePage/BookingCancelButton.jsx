// UI
import { Button, Text, Spinner } from "@chakra-ui/react"

// App
import { usePatchBookingCancel } from "@/hooks/tickets/booking/usePatchBookingCancel"

// Components here


const BookingCancelButton = ({ bookingStatus, bookingId, onSuccess }) => {
  const { patchBookingCancel, loading: loadingBooking, error: errorBooking } = usePatchBookingCancel()

  if (errorBooking) return <Text color="red.400">{errorBooking}</Text>

  const handleBookingCancel = async () => {
    const result = await patchBookingCancel(bookingId)
    if (result) {
      alert("✅ Booking has been canceled successfully!")
      if (onSuccess) onSuccess()
    } else {
      alert("❌ Booking has not been canceled successfully!")
    }
  }

  return (
    <Button
      disabled={bookingStatus !== "reserved" || loadingBooking}
      onClick={handleBookingCancel}
      colorScheme="teal"
      bg="#84DCC6"
      size="sm"
    >
      {loadingBooking ? <Spinner size="sm" mr={2} /> : "Cancel"}
    </Button>
  )
}
export default BookingCancelButton