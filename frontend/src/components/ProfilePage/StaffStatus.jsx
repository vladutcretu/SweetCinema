// React, dependencies & packages
import React from 'react'

// UI
import { Box, Heading, SimpleGrid, Text } from '@chakra-ui/react'

// App
import { useAuthContext } from '@/contexts/AuthContext'
import ForwardButton from '@/components/common/ForwardButton'

// Components here


const StaffStatus = () => {
  const { user, twoFactorAuth } = useAuthContext()

  return (
    <Box
      bg="#4B4E6D"
      borderRadius="lg"
      p={6}
      boxShadow="md"
      mt={3}
    >
      <Heading size="xl">Your roles:</Heading>
      {user?.groups.length > 0 && (
        <SimpleGrid columns={3} spacing={2}>
          <Text><b>Groups:</b> {user?.groups.join(", ")}</Text>
          <Text><b>Password:</b> {user?.password.toString() === "true" ? "✅" : "❌"}</Text>
          <Text><b>2FA active?</b> {twoFactorAuth.toString() ==="true" ? "✅" : "❌"}</Text>
        </SimpleGrid>
      )}
      {(user?.is_staff || user?.is_superuser) && (
        <SimpleGrid columns={3} spacing={2}>
          <Text><b>City ID:</b> {user?.city}</Text>
          <Text><b>Staff: </b> {user?.is_staff.toString() === "true" ? "✅" : "❌"}</Text>
          <Text><b>Superuser: </b> {user?.is_superuser.toString() === "true" ? "✅" : "❌"}</Text>
        </SimpleGrid>
      )}
      {(user?.groups.length > 0 || user?.is_staff || user?.is_superuser) && (
        <ForwardButton to={'/staff/'} text={"Staff Dashboard"}/>
      )}
    </Box>
  )
}
export default StaffStatus