// UI
import { Button, Spinner } from "@chakra-ui/react"

// Components here


const SubmitButton = ({ onClick, loading, text }) => {
  return (
    <Button
      type="submit"
      onClick={onClick}
      colorScheme="teal"
      bg="#84DCC6"
      size="sm"
      disabled={loading}
    >
      {loading ? <Spinner size="sm" mr={2} /> : text}
    </Button>
  )
}
export default SubmitButton