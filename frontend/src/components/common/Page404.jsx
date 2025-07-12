// React, depedencies & packages
import { Link } from 'react-router-dom'

// UI
import { Box, Heading, Text, Button } from '@chakra-ui/react'

// Components here

const Page404 = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      textAlign="center"
    >
      <Heading as="h1" size="2xl" mb={4}>404 - Page Not Found</Heading>
      <Text fontSize="lg" mb={6}>Oops! The page you are looking for does not exist or you do not have access for it.</Text>
      <Button as={Link} to="/" colorScheme="teal" size="lg">Go to Homepage</Button>
    </Box>
  )
}
export default Page404