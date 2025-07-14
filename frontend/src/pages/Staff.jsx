// UI
import { Box, Heading, Stack, Tabs } from "@chakra-ui/react"

// App
import { useAuthContext } from "@/contexts/AuthContext"
import Page404 from "@/components/common/Page404"
import BackButton from "@/components/common/BackButton"

import StaffSetPass from "@/components/StaffPage/StaffSetPass"
import StaffVerifyPass from "@/components/StaffPage/StaffVerifyPass"

import UserManagement from "@/components/StaffPage/UserManagement"
import CityManagement from "@/components/StaffPage/CityManagement"
import TheaterManagement from "@/components/StaffPage/TheaterManagement"
import GenreManagement from "@/components/StaffPage/GenreManagement"
import MovieManagement from "@/components/StaffPage/MovieManagement"
import ShowtimeManagement from "@/components/StaffPage/ShowtimeManagement"
import BookingManagement from "@/components/StaffPage/BookingManagement"
import PaymentManagement from "@/components/StaffPage/PaymentManagement"
import ShowtimeReport from "@/components/StaffPage/ShowtimeReport"

import BookingDashboard from "@/components/staff/BookingDashboard"
import ShowtimeSeatManager from "@/components/staff/ShowtimeDashboard"

import RequirePermission from "@/utils/RequirePermissions"

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
              {/* Staff tabs */}
              <RequirePermission staff={true}><Tabs.Trigger value="user">Manage User</Tabs.Trigger></RequirePermission>
              {/* Manager tabs */}
              <RequirePermission groups={["Manager"]}><Tabs.Trigger value="city">Manage City</Tabs.Trigger></RequirePermission>
              <RequirePermission groups={["Manager"]}><Tabs.Trigger value="theater">Manage Theater </Tabs.Trigger></RequirePermission>
              {/* Manager & Employee tabs */}
              <RequirePermission groups={["Manager", "Employee"]}><Tabs.Trigger value="genre">Manage Genre</Tabs.Trigger></RequirePermission>
              <RequirePermission groups={["Manager", "Employee"]}><Tabs.Trigger value="movie">Manage Movie</Tabs.Trigger></RequirePermission>
              <RequirePermission groups={["Manager", "Employee"]}><Tabs.Trigger value="showtime">Manage Showtime</Tabs.Trigger></RequirePermission>
              {/* Manager tabs */}
              <Tabs.Trigger value="booking">Show Bookings</Tabs.Trigger>
              <Tabs.Trigger value="payment">Show Payments</Tabs.Trigger>
              <Tabs.Trigger value="showtimeR">Report Showtime</Tabs.Trigger>
              {/* Cashier tabs */}
              <Tabs.Trigger value="bookingD">Booking Dashboard</Tabs.Trigger>
              <Tabs.Trigger value="showtimeD">Showtime Dashboard</Tabs.Trigger>
            </Tabs.List>

            {/* Staff */}
            <Tabs.Content value="user"><UserManagement /></Tabs.Content>
            {/* Manager */}
            <Tabs.Content value="city"><CityManagement /></Tabs.Content>
            <Tabs.Content value="theater"><TheaterManagement /></Tabs.Content>
            {/* Manager & Employee */}
            <Tabs.Content value="genre"><GenreManagement /></Tabs.Content>
            <Tabs.Content value="movie"><MovieManagement /></Tabs.Content>
            <Tabs.Content value="showtime"><ShowtimeManagement /></Tabs.Content>
            {/* Manager */}
            <Tabs.Content value="booking"><BookingManagement /></Tabs.Content>
            <Tabs.Content value="payment"><PaymentManagement /></Tabs.Content>
            <Tabs.Content value="showtimeR"><ShowtimeReport /></Tabs.Content>
            {/* Cashier */}
            <Tabs.Content value="bookingD"><BookingDashboard/></Tabs.Content>
            <Tabs.Content value="showtimeD"><ShowtimeSeatManager /></Tabs.Content>

          </Tabs.Root>
          <BackButton to={'/'} text={"home"} />
        </Box> 
      </Stack>
    </Box>
  )
}
export default Staff