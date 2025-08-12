// UI
 import { Center, Heading, Spinner, Text } from "@chakra-ui/react"

// App
import { useAuthContext } from "@/contexts/AuthContext"
import { useReadBookingsCashier } from "@/hooks/tickets/booking/staff/useReadBookingsCashier"
import { useUpdateBookingCashier } from "@/hooks/tickets/booking/staff/useUpdateBookingCashier"
import { formatDate, formatTime } from "@/utils/DateTimeFormat"
import SubmitButton from "@/components/common/SubmitButton"
import ReusableTable from "@/components/common/ReusableTable"

// Components here


const BookingDashboard = () => {
  const { user } = useAuthContext()
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
    refetch: readBookingsCashier 
  } = useReadBookingsCashier(user?.city_id)
  const { 
    updateBookingCashier, 
    loading: loadingUpdateBooking, 
    error: errorUpdateBooking
  } = useUpdateBookingCashier()

  if (loadingBookings || loadingUpdateBooking) return <Spinner />
  if (errorBookings) return <Text color="red.400">{errorBookings}</Text>
  if (errorUpdateBooking) return <Text color="red.400">{errorUpdateBooking}</Text>

  const handleUpdate = async (bookingId) => {
    const result = await updateBookingCashier(bookingId)
    if (result) return await readBookingsCashier(user?.city_id)
  }

  // Read bookings
  const columns = [
    { key: "id", title: "ID", sortable: true },
    { key: "user", title: "User" },
    { key: "showtime", title: "Showtime", sortable: true },
    { key: "seat", title: "Seat" },
    { key: "status", title: "Status" },
    { key: "booked_at", title: "Booked on", sortable: true }
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
    }
  }
  const renderActions = (booking) => {
    if (booking.status !== "Reserved") return null
    return (<SubmitButton
      onClick={() => handleUpdate(booking.id)}
      loading={loadingUpdateBooking}
      text={"Set as purchased"}
    />
    )
  }

  return (
    <>
      <Center><Heading size="xl">Booking Dashboard</Heading></Center>

      {/* Booking table & Update/Delete instance */}
      <ReusableTable
        loading={loadingBookings}
        error={errorBookings}
        data={bookings}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
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
export default BookingDashboard