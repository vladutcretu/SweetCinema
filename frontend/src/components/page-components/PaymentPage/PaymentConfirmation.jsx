// React, depedencies & packages
import { useNavigate } from "react-router-dom"

// UI
import { Box, Button, Spinner, Text } from "@chakra-ui/react"

// App
import { useCreatePayment } from "@/hooks/tickets/payment/useCreatePayment"

// Components here


const PaymentConfirmation = ({ bookingIds, paymentAmount, paymentMethod }) => {
  const { createPayment, loading, error } = useCreatePayment()
  const navigate = useNavigate()

  const handlePayment = async () => {
    const result = await createPayment(bookingIds, paymentAmount, paymentMethod)
    if (result) {
      alert("✅ Payment accepted! Enjoy your show!")
      navigate('/')
    } else {
      alert("✅ Payment declined! Please try again!")
      navigate('/')
    }
  }

  if (error) {
    alert(`${error}`)
    return <Text>{error}</Text>
  }
  
  return (
    <Box mt={4}>
      <Button
        disabled={loading || !bookingIds || !paymentAmount || !paymentMethod}
        onClick={handlePayment}
        colorScheme="teal"
        variant="outline"
        size="sm"
      >
        {loading ? <Spinner size="sm" mr={2} /> : `Pay ${paymentAmount}`}
      </Button>
    </Box>
  )
}
export default PaymentConfirmation