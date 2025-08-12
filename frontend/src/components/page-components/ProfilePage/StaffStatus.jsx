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
        <SimpleGrid columns={5} spacing={2}>
          <Text><b>Role:</b> {user?.role}</Text>
          <Text><b>Password:</b> {user?.password === true ? "✅" : "❌"}</Text>
          <Text><b>2FA active?</b> {twoFactorAuth === true ? "✅" : "❌"}</Text>
          <Text><b>Staff: </b> {user?.is_staff === true ? "✅" : "❌"}</Text>
          <Text><b>Superuser: </b> {user?.is_superuser === true ? "✅" : "❌"}</Text>
        </SimpleGrid>

        {
          (user?.is_superuser || user?.is_staff || ["Manager", "Planner", "Cashier"].includes(user?.role)) 
          &&
          <ForwardButton to={'/staff/'} text={"Staff Dashboard"}/>
        }
    </Box>
  )
}
export default StaffStatus