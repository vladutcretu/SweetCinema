// UI
import { Center, Heading } from '@chakra-ui/react'

// App
import { useReadBookingsManager } from '@/hooks/tickets/booking/staff/useReadBookingsManager'
import { formatDate, formatTime } from '@/utils/DateTimeFormat'
import ReusableTable from '@/components/common/ReusableTable'

// Write components here


const BookingManagement = () => {
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
    error: errorBookings 
  } = useReadBookingsManager()
  
  // Read bookings
  const columns = [
    { key: "id", title: "ID", sortable: true },
    { key: "user", title: "User" },
    { key: "showtime", title: "Showtime", sortable: true },
    { key: "seat", title: "Seat" },
    { key: "status", title: "Status" },
    { key: "booked_at", title: "Booked", sortable: true },
    { key: "updated_at", title: "Updated", sortable: true }, 
  ]

  const renderCell = (booking, column) => {
    switch (column.key) {
      case "id": return booking.id
      case "user": return booking.user
      case "showtime": return (`
        ${booking.showtime.movie_title}: 
        ${booking.showtime.city_name}, 
        ${booking.showtime.theater_name}, 
        ${formatDate(booking.showtime.starts_at)}, 
        ${formatTime(booking.showtime.starts_at)}
      `)
      case "seat": return `R${booking.seat.row}-C${booking.seat.column}`
      case "status": return booking.status
      case "booked_at": return (`${formatDate(booking.booked_at)}, ${formatTime(booking.booked_at)}`)
      case "updated_at": return (`${formatDate(booking.updated_at)}, ${formatTime(booking.updated_at)}`)
    }
  }

  return (
    <>
      <Center><Heading size="xl">Booking Management</Heading></Center>

      {/* Booking table & Update/Delete instance */}
      <ReusableTable
        loading={loadingBookings}
        error={errorBookings}
        data={bookings}
        columns={columns}
        renderCell={renderCell}
        noDataMessage="No bookings found!"
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
    </>
  )
}
export default BookingManagement