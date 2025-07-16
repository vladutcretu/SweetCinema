// React, dependencies & packages
import { useParams } from "react-router-dom"

// UI
import { Box, Stack, Heading, Text, Spinner } from "@chakra-ui/react"

// App
import { useGetShowtime } from "@/hooks/showtimes/useGetShowtime"
import { formatDate, formatTime } from "@/utils/DateTimeFormat"
import BackButton from "@/components/common/BackButton"
import ShowtimeSeats from "./ShowtimeSeats"

// Components here


const ShowtimePresentation = () => {
  const { showtimeId } = useParams()
  const { showtime, loading: showtimeLoading, error: showtimeError } = useGetShowtime(showtimeId)

  if (showtimeLoading) {
    return <Spinner />
  }
    
  if (showtimeError) {
    return <Text color="red.400">An error occurred: {showtimeError}</Text>
  }  

  return (
    <Box px={6} py={10}>
        <Stack spacing={8}>
        <Heading mb={6}>Showtime</Heading>

          <Box
            bg="#7B7E82"
            borderRadius="lg"
            p={6}
            boxShadow="md"
          >
            {/* Showtime Detail */}
            <Stack spacing={3}>
                <Heading size="xl">{showtime.movie.title}</Heading>
                <Text><b>Theater:</b> {showtime.theater.name}</Text>
                <Text><b>Date & Time:</b> {formatTime(showtime.starts_at)}, {formatDate(showtime.starts_at)}</Text>
                <Text><b>Format:</b> {showtime.format}</Text>
                <Text><b>Ticket Price:</b> ${showtime.price}</Text>
            </Stack> 

            {/* Seats section*/}
            <ShowtimeSeats showtimeId={showtimeId} theaterColumns={showtime.theater.columns} showtimeStart={showtime.starts_at}/>

            {/* Back to movie list button */}
            <BackButton 
                to={"/"} 
                text={"home"} 
            />
          </Box>
        </Stack>
    </Box>
  )
}
export default ShowtimePresentation