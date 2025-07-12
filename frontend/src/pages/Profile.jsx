// React, dependencies & packages
import React from 'react'

// UI
import { Box, Heading, Stack } from '@chakra-ui/react'

// App
import { useAuthContext } from '../contexts/AuthContext'
import Page404 from '@/components/common/Page404'
import StaffStatus from '@/components/ProfilePage/StaffStatus'
import BookingHistory from '@/components/ProfilePage/BookingHistory'
import BackButton from '@/components/common/BackButton'

// Components here


const UserProfile = () => {
  const { isAuthenticated, user } = useAuthContext()
  if (!isAuthenticated) return <Page404 />


  return (
      <Box px={6} py={10}>
        <Stack spacing={8}>
          <Heading mb={6}>{user ? `${user?.username}'s Profile` : "User Profile"}</Heading>
          <Box
            bg="#7B7E82"
            borderRadius="lg"
            p={6}
            boxShadow="md"
          >
            {/* User Detail - potentially */}

            {/* Staff Detail */}
            <StaffStatus />

            {/* Bookings Detail */}
            <BookingHistory />

            {/* Back to home button */}
            <BackButton to={'/'} text={"home"} />
          </Box>
        </Stack>
      </Box>
  )
}

export default UserProfile
