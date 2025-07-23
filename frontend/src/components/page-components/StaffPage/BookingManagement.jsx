// UI
import { Center, Heading } from '@chakra-ui/react'

// App
import { useReadBookingsManager } from '@/hooks/tickets/booking/staff/useReadBookingsManager'
import useSearchBar from '@/hooks/useSearchBar'
import { formatDate, formatTime } from '@/utils/DateTimeFormat'
import SearchBar from '@/components/common/SearchBar'
import ReusableTable from '@/components/common/ReusableTable'

// Write components here


const BookingManagement = () => {
  const { bookings, loading: loadingBookings, error: errorBookings } = useReadBookingsManager()
  const { searchTerm, handleChangeSearch, filteredData: filteredBookings } = useSearchBar(
    bookings, 
    (booking) => booking.showtime.movie_title
  )
  
  // Read bookings
  const columns = [
    { key: "id", title: "ID" },
    { key: "user", title: "User" },
    { key: "showtime", title: "Showtime" },
    { key: "seat", title: "Seat" },
    { key: "status", title: "Status" },
    { key: "time", title: "Created / Updated" }
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
      case "time": return (`
        Booked: ${formatDate(booking.booked_at)}, ${formatTime(booking.booked_at)} / 
        Updated: ${formatDate(booking.updated_at)}, ${formatTime(booking.updated_at)}
      `)
    }
  }

  return (
    <>
      <Center><Heading size="xl">Booking Management</Heading></Center>

      {/* Search Bar */}
      <SearchBar value={searchTerm} onChange={handleChangeSearch} text={"movie title"} />

      {/* Booking table & Update/Delete instance */}
      <ReusableTable
        loading={loadingBookings}
        error={errorBookings}
        data={filteredBookings}
        columns={columns}
        renderCell={renderCell}
        noDataMessage="No bookings found!"
      />
    </>
  )
}
export default BookingManagement