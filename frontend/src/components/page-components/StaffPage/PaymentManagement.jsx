// UI
import { Center, Heading } from '@chakra-ui/react'

// App
import { useReadPayments } from '@/hooks/tickets/payment/staff/useReadPayments'
import { formatDate, formatTime } from '@/utils/DateTimeFormat'
import ReusableTable from '@/components/common/ReusableTable'

// Write components here


const PaymentManagement = () => {
  const { 
    payments,
    page, 
    setPage, 
    pageSize, 
    setPageSize,
    sortField, 
    setSortField,
    sortOrder,
    setSortOrder,  
    loading: loadingPayments, 
    error: errorPayments 
  } = useReadPayments()
  
  // Read payments
  const columns = [
    { key: "id", title: "ID", sortable: true },
    { key: "user", title: "User", sortable: true },
    { key: "booking", title: "Booking" },
    { key: "seat", title: "Seat" },
    { key: "amount", title: "Amount" },
    { key: "method", title: "Method" },
    { key: "status", title: "Status" },
    { key: "paid_at", title: "Paid", sortable: true },
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
      case "paid_at": return `${formatDate(payment.paid_at)}, ${formatTime(payment.paid_at)}`
    }
  }

  return (
    <>
      <Center><Heading size="xl">Payment Management</Heading></Center>

      {/* Payment table & Update/Delete instance */}
      <ReusableTable
        loading={loadingPayments}
        error={errorPayments}
        data={payments}
        columns={columns}
        renderCell={renderCell}
        noDataMessage="No payments found!"
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
export default PaymentManagement