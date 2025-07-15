// React, depedencies & packages
import { useState } from "react"

// UI
import { Box, NativeSelect } from "@chakra-ui/react"

// Components here


const PaymentMethod = ({ onSelect }) => {
  const [method, setMethod] = useState("visa")

  const handleChange = (event) => {
    const selectedMethod = event.target.value
    setMethod(selectedMethod)
    onSelect(selectedMethod)
  }

  return (
    <Box as="form" maxW={"fit-content"} mt={3}>
      <NativeSelect.Root
        id="payment-method"
        value={method}
        onChange={handleChange}
        variant="subtle"
        size="xs"
      >
        <NativeSelect.Field
          placeholder="Select payment method"
        >
          {/* Fetch this data from backend when more options are added */}
          <option value="visa">VISA</option>
          <option value="mastercard">MasterCard</option>
        </NativeSelect.Field>
        <NativeSelect.Indicator />
      </NativeSelect.Root>
    </Box>
  )
}
export default PaymentMethod