// React, depedencies & packages
import { useState } from "react"
import { useLocation } from "react-router-dom"

// UI
import { Box, Stack, Heading, Text, Spinner, SimpleGrid } from "@chakra-ui/react"

// App
import { useAuthContext } from "@/contexts/AuthContext"
import { useReadPaymentBookings } from "@/hooks/tickets/useReadPaymentBookings"
import Page404 from "@/components/common/Page404"
import { formatDate, formatTime } from "@/utils/DateTimeFormat"
import PaymentMethod from "./PaymentMethod"
import PaymentTimer from "./PaymentTimer"
import PaymentConfirmation from "./PaymentConfirmation"

// Components here


const PaymentPresentation = () => {
  const { isAuthenticated } = useAuthContext()
  if (!isAuthenticated) return <Page404 />

  const [paymentMethod, setPaymentMethod] = useState('')
  
  // Get local states from ShowtimeTicket.Purchase
  const location = useLocation()
  const { bookingIds, seatsNumber } = location.state || {}
  if (!bookingIds || !seatsNumber) return <Text color="red.500">Missing booking information. Please reserve seats first!</Text>

  const { bookings, totalPrice, loadingBookings, errorBookings } = useReadPaymentBookings(bookingIds)
  if (loadingBookings) return <Spinner />
  if (errorBookings) return <Text color="red.400">An error occurred: {errorBookings}</Text>
  if (!bookings?.length) return <Text color="red.400">No bookings found!</Text>
  if (!totalPrice) return <Text color="red.400">No total price found!</Text>

  return (
    <Box px={6} py={10}>
      <Stack spacing={8}>
      <Heading mb={6}>Payment</Heading>

        <Box
          bg="#7B7E82"
          borderRadius="lg"
          p={6}
          boxShadow="md"
        >
          {/* Showtime Detail */}
          <Stack spacing={3}>
            <Heading size="xl">{bookings[0].movie_title} ({bookings[0].movie_release})</Heading>
            <Text><b>Format:</b> {bookings[0].showtime_format}</Text> 
            <Text><b>Date/Time:</b> {formatDate(bookings[0].showtime_starts)}, {formatTime(bookings[0].showtime_starts)}</Text>
            <Text><b>Location:</b> {bookings[0].city_name}, {bookings[0].theater_name}</Text>
            <Text><b>Location address:</b> {bookings[0].city_address}</Text>
          </Stack>

          {/* Bookings Detail */}
          <Stack spacing={3} mt={10}>
            <Heading size="md">Please confirm the payment for {seatsNumber} seats:</Heading>
            <SimpleGrid columns={bookings.length} spacing={2}>
              {bookings.map((booking) => (
                <Box
                  key={booking.id}
                  bg="#4B4E6D"
                  p={2}
                  minW="20px"
                  minH="20px"
                  borderWidth="1px"
                  borderRadius="md"
                  textAlign="center"
                >
                  <Text fontWeight="bold">R{bookings.seat.row} C{bookings.seat.column}</Text>
                  <Text><b>Price:</b> ${bookings[0].showtime_price}</Text>
                </Box>
              ))}
            </SimpleGrid>
            <Text fontWeight="bold">Total price: ${totalPrice}</Text>
          </Stack>

          {/* Payment method section*/}
          <PaymentMethod onSelect={setPaymentMethod} />

          {/* Paymet timer section*/}
          <PaymentTimer bookingIds={bookingIds} />

          {/* Payment confirmation button */}
          <PaymentConfirmation bookingIds={bookingIds} paymentAmount={totalPrice} paymentMethod={paymentMethod} />
        </Box>

      </Stack>
    </Box>
  )
}
export default PaymentPresentation