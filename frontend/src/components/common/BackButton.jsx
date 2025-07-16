// React, depedencies & packages
import { Link } from "react-router-dom"

// UI
import { Button } from "@chakra-ui/react"

// Components here


const BackButton = ({ to, text }) => {
  return (
    <Button
      as={Link}
      to={to}
      // mt="auto"
      mb="auto"
      colorScheme="teal"
      variant="ghost"
      size="sm"
    >
      ← Back to {text}
    </Button>
  )
}
export default BackButton