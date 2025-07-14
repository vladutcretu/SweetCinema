// UI
import { Center, Heading } from '@chakra-ui/react'

// App
import { useReadBookings } from '@/hooks/tickets/useReadBookings'
import useSearchBar from '@/hooks/useSearchBar'
import { formatDate, formatTime } from '@/utils/DateTimeFormat'
import SearchBar from '../common/SearchBar'
import ReusableTable from '../common/ReusableTable'

// Write components here


const BookingManagement = () => {
  const { bookings, loading: loadingBookings, error: errorBookings } = useReadBookings()
  const { searchTerm, handleChangeSearch, filteredData: filteredBookings } = useSearchBar(
    bookings, 
    (booking) => booking.showtime.movie.title
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
        ${booking.showtime.movie.title}: 
        ${booking.showtime.theater.city.name}, 
        ${booking.showtime.theater.name}, 
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