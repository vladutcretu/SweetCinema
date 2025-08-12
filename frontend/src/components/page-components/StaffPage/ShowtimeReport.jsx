// React, dependencies & packages
import { useState } from "react"

// UI
import { Box, Center, Heading, NativeSelect, SimpleGrid, Spinner, Text } from "@chakra-ui/react"

// App
import { useReadShowtimes } from "@/hooks/showtimes/staff/useReadShowtimes"
import { useReadShowtimeReport } from "@/hooks/showtimes/staff/useReadShowtimeReport"
import { formatDate, formatTime } from "@/utils/DateTimeFormat"

// Components here


const ShowtimeReport = () => {
  const { showtimes, loading: loadingShowtimes, error: errorShowtimes } = useReadShowtimes(1, 10)
  const [selectedShowtimeId, setSelectedShowtimeId] = useState(null)
  const { showtimeReport, loading: loadingShowtimeReport, error: errorShowtimeReport, } = useReadShowtimeReport(selectedShowtimeId)

  if (loadingShowtimes || loadingShowtimeReport) return <Spinner />
  if (errorShowtimes) return <Text color="red.400">{errorShowtimes}</Text>
  if (errorShowtimeReport) return <Text color="red.400">{errorShowtimeReport}</Text>

  return (
    <>
      <Center><Heading size="xl">Showtime Report</Heading></Center>

      {/* Dropdown for Showtime selection */}
      <NativeSelect.Root
        value={selectedShowtimeId || ""}
        onChange={(e) => setSelectedShowtimeId(e.target.value)}
        bg="black"
        color="white"
        maxW="max-content"
      >
        <NativeSelect.Field placeholder="Choose showtime to generate report">
          {showtimes?.results?.map((s) => (
            <option key={s.id} value={s.id}>
              {s.movie_title}, {s.city_name}, {s.theater_name}, {formatDate(s.starts_at)}, {formatTime(s.starts_at)}
            </option>
          ))}
        </NativeSelect.Field>
        <NativeSelect.Indicator />
      </NativeSelect.Root>

      {/* Display Showtime Report */}
      {showtimeReport && (
        <Box bg="#84DCC6" borderRadius="md" p={6} mt={4}>
          <SimpleGrid columns={3} spacingY={2} spacingX={6}>
            <Text><strong>Movie:</strong> {showtimeReport.movie_title}</Text>
            <Text><strong>Location:</strong> {showtimeReport.city_name}, {showtimeReport.theater_name}</Text>
            <Text><strong>Date/Time:</strong> {formatDate(showtimeReport.starts_at)}, {formatTime(showtimeReport.starts_at)}</Text>
            <Text><strong>Tickets Sold:</strong> {showtimeReport.tickets_sold}</Text>
            <Text><strong>Total Revenue:</strong> ${showtimeReport.total_revenue}</Text>
            <Text><strong>Occupancy:</strong> {showtimeReport.occupancy_percentage}%</Text>
          </SimpleGrid>
        </Box>
      )}
    </>
  )
}
export default ShowtimeReport