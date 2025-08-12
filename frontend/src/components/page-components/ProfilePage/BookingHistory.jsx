// UI
import { Box, Heading, Text } from "@chakra-ui/react"

// App
import { useReadBookings } from "@/hooks/tickets/booking/useReadBookings"
import { useUpdateBooking } from "@/hooks/tickets/booking/useUpdateBooking"
import { formatDate, formatTime } from "@/utils/DateTimeFormat"
import ReusableTable from "@/components/common/ReusableTable"
import SubmitButton from "@/components/common/SubmitButton"

// Components here


const BookingHistory = () => {
  const { 
    bookings, 
    page, 
    setPage, 
    pageSize, 
    setPageSize,
    sortField, 
    setSortField,
    sortOrder,
    setSortOrder,
    loading: loadingBookings, 
    error: errorBookings, 
    refetch: readBookings
  } = useReadBookings()
  const { 
    updateBooking, 
    loading: loadingUpdateBooking, 
    error: errorUpdateBooking
  } = useUpdateBooking()

  if (errorUpdateBooking) return <Text color="red.400">{errorUpdateBooking}</Text>

  const handleUpdate = async (bookingId) => {
    const result = await updateBooking(bookingId)
    if (result) return await readBookings()
  }

  // Build table
  const columns = [
    { key: "booked_at", title: "Booking on", sortable: true },
    { key: "showtime", title: "Showtime", sortable: true },
    { key: "date-time", title: "Date/Time" },
    { key: "seat", title: "Seat" },
    { key: "status", title: "Status" },
    { key: "reservation-expire", title: "Reservation expires on" }
  ]
  const renderCell = (booking, column) => {
    switch (column.key) {
      case "booked_at": return `${formatDate(booking.booked_at)}, ${formatTime(booking.booked_at)}`
      case "showtime": return (`
        ${booking.showtime.movie_title}
        ${booking.showtime.city_name}, 
        ${booking.showtime.theater_name}
      `)
      case "date-time": return `${formatDate(booking.showtime.starts_at)}, ${formatTime(booking.showtime.starts_at)}`
      case "seat": return `R${booking.seat.row}-C${booking.seat.column}`
      case "status": return booking.status
      case "reservation-expire": {
        if (booking.status !== "Reserved") return null
        return `${formatDate(booking.expires_at)}, ${formatTime(booking.expires_at)}`
      }
    }
  }
  const renderActions = (booking) => {
    if (booking.status !== "Reserved") return null
    return (<SubmitButton
      onClick={() => handleUpdate(booking.id)}
      loading={loadingUpdateBooking}
      text={"Cancel"}
    />
    )
  }

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
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        sortField={sortField}
        sortOrder={sortOrder}
        onSortChange={(field, order) => {
          setSortField(field)
          setSortOrder(order)
          setPage(1)
        }}
      />
  </Box>
  )
}
export default BookingHistory