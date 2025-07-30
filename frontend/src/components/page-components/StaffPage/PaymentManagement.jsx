// UI
import { Center, Heading } from '@chakra-ui/react'

// App
import { useReadPayments } from '@/hooks/tickets/payment/staff/useReadPayments'
import useSearchBar from '@/hooks/useSearchBar'
import { formatDate, formatTime } from '@/utils/DateTimeFormat'
import SearchBar from '@/components/common/SearchBar'
import ReusableTable from '@/components/common/ReusableTable'

// Write components here


const PaymentManagement = () => {
  const { payments, loading: loadingPayments, error: errorPayments } = useReadPayments()
  const { searchTerm, handleChangeSearch, filteredData: filteredPayments } = useSearchBar(
    payments, 
    (payment) => payment.bookings[0].showtime.movie_title
  )
  
  // Read payments
  const columns = [
    { key: "id", title: "ID" },
    { key: "user", title: "User" },
    { key: "booking", title: "Booking" },
    { key: "seat", title: "Seat" },
    { key: "amount", title: "Amount" },
    { key: "method", title: "Method" },
    { key: "status", title: "Status" },
    { key: "time", title: "Created" }
  ]

  const renderCell = (payment, column) => {
    switch (column.key) {
      case "id": return payment.id
      case "user": return payment.user
      case "booking": return (`
        ${payment.bookings[0].showtime.movie_title}: 
        ${payment.bookings[0].showtime.city_name}, 
        ${payment.bookings[0].showtime.theater_name}, 
        ${formatDate(payment.bookings[0].showtime.starts_at)}, 
        ${formatTime(payment.bookings[0].showtime.starts_at)}
      `)
      case "seat": return (`
        ${payment.bookings.map((booking) => 
          `R${booking.seat.row}-C${booking.seat.column}`).join(", ")
        }
      `)
      case "amount": return payment.amount
      case "method": return payment.method 
      case "status": return payment.status
      case "time": return `${formatDate(payment.paid_at)}, ${formatTime(payment.paid_at)}`
    }
  }

  return (
    <>
      <Center><Heading size="xl">Payment Management</Heading></Center>

      {/* Search Bar */}
      <SearchBar value={searchTerm} onChange={handleChangeSearch} text={"movie title"} />

      {/* Payment table & Update/Delete instance */}
      <ReusableTable
        loading={loadingPayments}
        error={errorPayments}
        data={filteredPayments}
        columns={columns}
        renderCell={renderCell}
        noDataMessage="No payments found!"
      />
    </>
  )
}
export default PaymentManagement