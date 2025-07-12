// UI
import { Box, Text, Progress } from "@chakra-ui/react"

// App
import { usePaymentTimeout } from "@/hooks/tickets/usePaymentTimeout"

// Components here


const PaymentTimer = ({ bookingIds }) => {
  const { secondsLeft, formattedTime } = usePaymentTimeout(bookingIds, 10)

  return (
    <Box mt={4} bg="84DCC6">
      <Text>You have {formattedTime} seconds to complete the payment!</Text>
      <Progress.Root
        value={(secondsLeft / 60) * 100}
        variant="subtle"
        size="sm"
      />
    </Box>
  )
}
export default PaymentTimer