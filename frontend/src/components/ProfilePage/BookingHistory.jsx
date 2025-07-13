// UI
import { Box, Heading } from "@chakra-ui/react"

// App
import { useUserBookingHistory } from "@/hooks/tickets/useUserBookingHistory"
import { formatDate, formatTime } from "@/utils/DateTimeFormat"
import ReusableTable from "../common/ReusableTable"
import BookingCancelButton from "./BookingCancelButton"

// Components here


const BookingHistory = () => {
  const { 
    bookings, 
    loading: loadingBookings, 
    error: errorBookings, 
    refetch: getUserBookingHistory 
  } = useUserBookingHistory()

  // Build table
  const columns = [
    { key: "booking-time", title: "Booking Time" },
    { key: "movie", title: "Movie" },
    { key: "location", title: "Location" },
    { key: "date-time", title: "Date/Time" },
    { key: "seat", title: "Seat" },
    { key: "status", title: "Status" },
    { key: "reservation-expire", title: "Reservation expire on" }
  ]
  const renderCell = (booking, column) => {
    switch (column.key) {
      case "booking-time": return `${formatDate(booking.booked_at)}, ${formatTime(booking.booked_at)}`
      case "movie": return booking.showtime.movie.title
      case "location": return `${booking.showtime.theater.city.name}, ${booking.showtime.theater.name}`
      case "date-time": return `${formatDate(booking.showtime.starts_at)}, ${formatTime(booking.showtime.starts_at)}`
      case "seat": return `R${booking.seat.row}-C${booking.seat.column}`
      case "status": return booking.status
      case "reservation-expire": return `${formatDate(booking.expires_at)}, ${formatTime(booking.expires_at)}`
      default: return booking[column.key]
    }
  }
  const renderActions = (booking) => [
    <BookingCancelButton key="cancel-button" bookingStatus={booking.status} bookingId={booking.id} onSuccess={getUserBookingHistory} />
  ]

  return (
    <Box
      bg="#4B4E6D"
      borderRadius="lg"
      p={6}
      boxShadow="md"
      mt={10}
    >
      <Heading size="xl">Booking History</Heading>
      <ReusableTable 
        loading={loadingBookings}
        error={errorBookings}
        columns={columns}
        data={bookings}
        renderCell={renderCell}
        renderActions={renderActions}
      />
  </Box>
  )
}
export default BookingHistory