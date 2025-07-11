// React, depedencies & packages
import { Link } from "react-router-dom"

// UI
import { Button } from "@chakra-ui/react"

// Components here


const ForwardButton = ({ to, text }) => {
  return (
    <Button
      as={Link}
      to={to}
      mt="auto"
      colorScheme="teal"
      variant="outline"
      size="sm"
    >
      → Go to {text}
    </Button>
  )
}
export default ForwardButton