// React, depedencies & packages
import { useNavigate } from "react-router-dom"

// UI
import { Box, Button, Spinner, Text } from "@chakra-ui/react"

// App
import { usePostPaymentComplete } from "@/hooks/tickets/usePostPaymentComplete"

// Components here


const PaymentConfirmation = ({ bookingIds, paymentAmount, paymentMethod }) => {
  const { postPaymentComplete, loading, error } = usePostPaymentComplete()
  const navigate = useNavigate()

  const handlePayment = async () => {
    const result = await postPaymentComplete(bookingIds, paymentAmount, paymentMethod)
    if (result) {
      alert("✅ Payment successfully! Enjoy your show!")
      navigate('/')
    } else {
      alert("✅ Payment unsuccessfully! Please try again!")
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