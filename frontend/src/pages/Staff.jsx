// UI
import { Box, Heading, Stack, Tabs } from "@chakra-ui/react"

// App
import { useAuthContext } from "@/contexts/AuthContext"
import Page404 from "@/components/common/Page404"
import StaffSetPass from "@/components/StaffPage/StaffSetPass"
import StaffVerifyPass from "@/components/StaffPage/StaffVerifyPass"

import RequirePermission from "@/utils/RequirePermissions"

import UserManagement from "@/components/staff/UserManagement"
import GenreManagement from "@/components/staff/GenreManagement"
import MovieManagement from "@/components/staff/MovieManagement"
import ShowtimeManagement from "@/components/staff/ShowtimeManagement"
import CityManagement from "@/components/staff/CityManagement"
import TheaterManagement from "@/components/staff/TheaterManagement"
import BookingManagement from "@/components/staff/BookingManagement"
import PaymentManagement from "@/components/staff/PaymentManagement"
import BookingDashboard from "@/components/staff/BookingDashboard"
import ShowtimeSeatManager from "@/components/staff/ShowtimeDashboard"
import ShowtimeReportDashboard from "@/components/staff/ShowtimeReport"
import BackButton from "@/components/common/BackButton"

// Components here


const Staff = () => {
  const { isAuthenticated, user, twoFactorAuth } = useAuthContext()
  if (!isAuthenticated) return <Page404 />
  if (!user?.password) return <StaffSetPass />
  if (!twoFactorAuth) return <StaffVerifyPass />
  
  return (
    <Box px={6} py={10}>
      <Stack spacing={8}>
        <Heading mb={6}>Staff - Dashboard</Heading>
        <Box
          bg="#7B7E82"
          borderRadius="lg"
          p={6}
          boxShadow="md"
        >
          <Tabs.Root lazyMount unmountOnExit size="lg" bg="#4B4E6D">
            <Tabs.List>
              <Tabs.Trigger value="user">Manage User</Tabs.Trigger>
              <Tabs.Trigger value="genre">Manage Genre</Tabs.Trigger>
              <Tabs.Trigger value="movie">Manage Movie</Tabs.Trigger>
              <Tabs.Trigger value="showtime">Manage Showtime</Tabs.Trigger>
              <Tabs.Trigger value="city">Manage City </Tabs.Trigger>
              <Tabs.Trigger value="theater">Manage Theater </Tabs.Trigger>
              <Tabs.Trigger value="booking">Show Booking</Tabs.Trigger>
              <Tabs.Trigger value="payment">Show Payment</Tabs.Trigger>
              <Tabs.Trigger value="bookingD">Booking Dashboard</Tabs.Trigger>
              <Tabs.Trigger value="showtimeD">Showtime Dashboard</Tabs.Trigger>
              <Tabs.Trigger value="showtimeR">Showtime Report</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="user"><UserManagement /></Tabs.Content>
            <Tabs.Content value="genre"><GenreManagement /></Tabs.Content>
            <Tabs.Content value="movie"><MovieManagement /></Tabs.Content>
            <Tabs.Content value="showtime"><ShowtimeManagement /></Tabs.Content>
            <Tabs.Content value="city"><CityManagement /></Tabs.Content>
            <Tabs.Content value="theater"><TheaterManagement /></Tabs.Content>
            <Tabs.Content value="booking"><BookingManagement /></Tabs.Content>
            <Tabs.Content value="payment"><PaymentManagement /></Tabs.Content>
            <Tabs.Content value="bookingD"><BookingDashboard/></Tabs.Content>
            <Tabs.Content value="showtimeD"><ShowtimeSeatManager /></Tabs.Content>
            <Tabs.Content value="showtimeR"><ShowtimeReportDashboard /></Tabs.Content>
          </Tabs.Root>
          <BackButton to={'/'} text={"home"} />
        </Box> 
      </Stack>
    </Box>
  )
}
export default Staff