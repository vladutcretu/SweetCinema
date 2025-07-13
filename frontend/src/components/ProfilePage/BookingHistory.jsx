// UI
import { Box, Heading, Table, Text, Spinner } from "@chakra-ui/react"

// App
import { useUserBookingHistory } from "@/hooks/tickets/useUserBookingHistory"
import { formatDate, formatTime } from "@/utils/DateTimeFormat"
import BookingCancelButton from "./BookingCancelButton"

// Components here


const BookingHistory = () => {
  const { 
    bookings, 
    loading: loadingBookings, 
    error: errorBookings, 
    refetch: getUserBookingHistory 
  } = useUserBookingHistory()

  return (
    <Box
      bg="#4B4E6D"
      borderRadius="lg"
      p={6}
      boxShadow="md"
      mt={10}
    >
      <Heading size="xl">Booking History</Heading>
      {loadingBookings && <Spinner />}
      {errorBookings && <Text color="red.400">{errorBookings}</Text>}
      {!loadingBookings && !errorBookings && !bookings?.length && <Text>You don't have any bookings!</Text>}
      {!loadingBookings && !errorBookings && bookings?.length > 0 && (
        <Table.Root interactive showColumnBorder variant="outline">
          <Table.Header>
            <Table.Row>
              {/* <Table.ColumnHeader>ID</Table.ColumnHeader> */}
              <Table.ColumnHeader>Booking Time</Table.ColumnHeader>
              <Table.ColumnHeader>Movie</Table.ColumnHeader>
              <Table.ColumnHeader>Location</Table.ColumnHeader>
              <Table.ColumnHeader>Date/Time</Table.ColumnHeader>
              <Table.ColumnHeader>Seat</Table.ColumnHeader>
              <Table.ColumnHeader>Status</Table.ColumnHeader>
              <Table.ColumnHeader>Reservation expire on</Table.ColumnHeader>
              <Table.ColumnHeader>Actions</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {bookings.map((booking) => (
              <Table.Row key={booking.id}>
                {/* <Table.Cell>{booking.id}</Table.Cell> */}
                <Table.Cell>{formatDate(booking.booked_at)}, {formatTime(booking.booked_at)}</Table.Cell>
                <Table.Cell>{booking.showtime.movie.title}</Table.Cell>
                <Table.Cell>{booking.showtime.theater.city.name}, {booking.showtime.theater.name}</Table.Cell>
                <Table.Cell>{formatDate(booking.showtime.starts_at)}, {formatTime(booking.showtime.starts_at)}</Table.Cell>
                <Table.Cell>R{booking.seat.row}-C{booking.seat.column}</Table.Cell>
                <Table.Cell>{booking.status}</Table.Cell>
                <Table.Cell>{formatDate(booking.expires_at)}, {formatTime(booking.expires_at)}</Table.Cell>
                <Table.Cell>
                  <BookingCancelButton 
                    bookingStatus={booking.status} 
                    bookingId={booking.id} 
                    onSuccess={getUserBookingHistory}
                  />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      )}
  </Box>
  )
}
export default BookingHistory