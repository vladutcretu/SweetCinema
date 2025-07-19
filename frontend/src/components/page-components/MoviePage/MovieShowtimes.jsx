// UI
import { useReadShowtimesByMovieAndCity } from "@/hooks/showtimes/useReadShowtimesByMovieAndCity"

// App
import { Box, Heading, Text, SimpleGrid, Stack, Spinner } from "@chakra-ui/react"
import ForwardButton from "@/components/common/ForwardButton"
import { formatDate, formatTime } from "@/utils/DateTimeFormat"

// Components here


const MovieShowtimes = ({ movieId, cityId }) => {
  const { showtimes, loading: showtimesLoading, error: showtimesError } = useReadShowtimesByMovieAndCity(movieId, cityId)

  if (showtimesLoading) return <Spinner />
    
  if (showtimesError) return <Text color="red.400">{showtimesError}</Text>

  return (
    <Box mt={10}>
      <Heading size="lg" mb={4}>Showtimes</Heading>

      {showtimes.length === 0 ? (
        <Text>No showtimes available.</Text>
      ) : (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4}>
            {showtimes.map((showtime) => (
            <Box
              key={showtime.id}
              borderWidth="1px"
              borderRadius="md"
              p={4}
              bg={"#4B4E6D"}
            >
              <Stack spacing={2}>
                <Text><b>Date:</b> {formatDate(showtime.starts_at)}</Text>
                <Text><b>Time:</b> {formatTime(showtime.starts_at)}</Text>
                <Text><b>Theater:</b> {showtime.theater_name}</Text>
                <Text><b>Format:</b> {showtime.format}</Text>
                <ForwardButton to={`/showtime/${showtime.id}/`} text={"showtime"} />
              </Stack>
            </Box>
            ))}
        </SimpleGrid>
      )}
    </Box>
  )
}
export default MovieShowtimes