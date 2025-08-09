// UI
import { Box, Heading, Stack, Tabs } from "@chakra-ui/react"

// App
import { useAuthContext } from "@/contexts/AuthContext"
import Page404 from "@/components/common/Page404"
import BackButton from "@/components/common/BackButton"

import StaffVerifyPass from "@/components/page-components/StaffPage/StaffVerifyPass"
import StaffSetPass from "@/components/page-components/StaffPage/StaffSetPass"

import UserManagement from "@/components/page-components/StaffPage/UserManagement"
import CityManagement from "@/components/page-components/StaffPage/CityManagement"
import TheaterManagement from "@/components/page-components/StaffPage/TheaterManagement"
import GenreManagement from "@/components/page-components/StaffPage/GenreManagement"
import MovieManagement from "@/components/page-components/StaffPage/MovieManagement"
import ShowtimeManagement from "@/components/page-components/StaffPage/ShowtimeManagement"
import BookingManagement from "@/components/page-components/StaffPage/BookingManagement"
import PaymentManagement from "@/components/page-components/StaffPage/PaymentManagement"
import ShowtimeReport from "@/components/page-components/StaffPage/ShowtimeReport"
import BookingDashboard from "@/components/page-components/StaffPage/BookingDashboard"
import ShowtimeDashboard from "@/components/page-components/StaffPage/ShowtimeDashboard"

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
              <RequirePermission roles={["Manager"]}><Tabs.Trigger value="city">Manage City</Tabs.Trigger></RequirePermission>
              <RequirePermission roles={["Manager"]}><Tabs.Trigger value="theater">Manage Theater </Tabs.Trigger></RequirePermission>
              {/* Manager & Planner tabs */}
              <RequirePermission roles={["Manager", "Planner"]}><Tabs.Trigger value="genre">Manage Genre</Tabs.Trigger></RequirePermission>
              <RequirePermission roles={["Manager", "Planner"]}><Tabs.Trigger value="movie">Manage Movie</Tabs.Trigger></RequirePermission>
              <RequirePermission roles={["Manager", "Planner"]}><Tabs.Trigger value="showtime">Manage Showtime</Tabs.Trigger></RequirePermission>
              {/* Manager tabs */}
              <RequirePermission roles={["Manager"]}><Tabs.Trigger value="booking">Show Bookings</Tabs.Trigger></RequirePermission>
              <RequirePermission roles={["Manager"]}><Tabs.Trigger value="payment">Show Payments</Tabs.Trigger></RequirePermission>
              <RequirePermission roles={["Manager"]}><Tabs.Trigger value="showtimeR">Report Showtime</Tabs.Trigger></RequirePermission>
              {/* Cashier tabs */}
              <RequirePermission roles={["Cashier"]}><Tabs.Trigger value="bookingD">Dashboard Booking</Tabs.Trigger></RequirePermission>
              <RequirePermission roles={["Cashier"]}><Tabs.Trigger value="showtimeD">Showtime Dashboard</Tabs.Trigger></RequirePermission>
            </Tabs.List>

            {/* Staff */}
            <Tabs.Content value="user"><UserManagement /></Tabs.Content>
            {/* Manager */}
            <Tabs.Content value="city"><CityManagement /></Tabs.Content>
            <Tabs.Content value="theater"><TheaterManagement /></Tabs.Content>
            {/* Manager & Planner */}
            <Tabs.Content value="genre"><GenreManagement /></Tabs.Content>
            <Tabs.Content value="movie"><MovieManagement /></Tabs.Content>
            <Tabs.Content value="showtime"><ShowtimeManagement /></Tabs.Content>
            {/* Manager */}
            <Tabs.Content value="booking"><BookingManagement /></Tabs.Content>
            <Tabs.Content value="payment"><PaymentManagement /></Tabs.Content>
            <Tabs.Content value="showtimeR"><ShowtimeReport /></Tabs.Content>
            {/* Cashier */}
            <Tabs.Content value="bookingD"><BookingDashboard /></Tabs.Content>
            <Tabs.Content value="showtimeD"><ShowtimeDashboard /></Tabs.Content>

          </Tabs.Root>
          <BackButton to={'/'} text={"home"} />
        </Box> 
      </Stack>
    </Box>
  )
}
export default Staff