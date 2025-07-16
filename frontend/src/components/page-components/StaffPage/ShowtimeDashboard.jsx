// React, dependencies & packages
import React, { useState } from "react"

// App
import { useAuthContext } from "@/contexts/AuthContext"
import { useReadShowtimesCashier } from "@/hooks/showtimes/staff/useReadShowtimesCashier"
import { Box, Center, Heading, NativeSelect, Spinner, Text } from "@chakra-ui/react"
import { formatDate, formatTime } from "@/utils/DateTimeFormat"
import ShowtimeSeats from "../ShowtimePage/ShowtimeSeats"

// Components here


const ShowtimeDashboard = () => {
  const { user } = useAuthContext()
  const { showtimes, loading: loadingShowtimes, error: errorShowtimes, } = useReadShowtimesCashier(user?.city)
  const [selectedShowtime, setSelectedShowtime] = useState({ id: "", columns: "", starts_at: "" })

  const handleShowtimeSelect = (event) => {
    const showtimeId = event.target.value
    const showtime = showtimes.find((s) => s.id.toString() === showtimeId)
    if (showtime) { 
      setSelectedShowtime({
        id: showtime.id,
        movie: showtime.movie.title,
        theater: showtime.theater.name,
        columns: showtime.theater.columns,
        starts_at: showtime.starts_at,
      })
    }
  }

  if (loadingShowtimes) return <Spinner />
  if (errorShowtimes) return <Text color="red.400">{errorShowtimes}</Text>

  return (
    <>
      <Center><Heading size="xl">Showtime Dashboard</Heading></Center>

      {/* Dropdown for Showtime selection */}
      <NativeSelect.Root
        value={selectedShowtime.id || ""}
        onChange={handleShowtimeSelect}
        bg="black"
        color="white"
        maxW="max-content"
      >
        <NativeSelect.Field placeholder="Choose showtime">
        {showtimes?.map((s) => (
          <option key={s.id} value={s.id}>
            {s.movie.title}, {s.theater.city.name}, {s.theater.name}, {formatDate(s.starts_at)}, {formatTime(s.starts_at)}
          </option>
        ))}
        </NativeSelect.Field>
        <NativeSelect.Indicator />
      </NativeSelect.Root>
      
      {/* Showtime & Seats section */}
      {selectedShowtime.id && (
        <Box mt={10}>
          <Center>
            <Heading size="lg" mb={4}>
                {selectedShowtime.movie}, {" "}
                {selectedShowtime.theater}, {" "}
                {formatDate(selectedShowtime.starts_at)}, {" "}
                {formatTime(selectedShowtime.starts_at)}
            </Heading>
          </Center>
          <ShowtimeSeats
            showtimeId={selectedShowtime.id} 
            theaterColumns={selectedShowtime.columns}
            />
        </Box>
       )}
    </>
  )
}
export default ShowtimeDashboard