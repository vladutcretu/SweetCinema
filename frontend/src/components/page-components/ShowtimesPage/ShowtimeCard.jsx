// UI
import { Box, Image, Heading, Stack, Badge, Text } from "@chakra-ui/react"

// App
import ForwardButton from "@/components/common/ForwardButton"
import { formatDate, formatTime } from "@/utils/DateTimeFormat"

// Components here


function ShowtimeCard({ showtime, movie }) {
  const { id, theater, starts_at, format, presentation } = showtime
  const { title, genres, poster } = movie

  return (
    <Box
      borderRadius="lg"
      overflow="hidden"
      bg="#7B7E82"
      transition="transform 0.2s"
      _hover={{ transform: "translateY(-10px)",  boxShadow: "xl" }}
      display="flex"
      flexDirection="column"
      height="100%"
    >
      {/* Movie Poster */}
      <Box position="relative" aspectRatio={1 / 1.5} width="100%">
        <Image
          src={poster}
          alt={`${title} poster`}
          objectFit="cover"
          width="100%"
          height="100%"
          fallbackSrc="favicon.png"
        />
      </Box>

      {/* Showtime & Movie Details */}
      <Stack spacing={1} p={3} flex="1">
        <Heading size="md" noOfLines={1}>{title}</Heading>
        <Stack direction="row" wrap="wrap">
          {genres.map((genre) => (
            <Badge key={genre.id} colorScheme="teal" variant="subtle">{genre.name}</Badge>
          ))}
        </Stack>
        <Text><b>Date/Time:</b> {formatDate(starts_at)}, {formatTime(starts_at)}</Text>
        <Text><b>Details:</b> {theater.name}, {format}, {presentation}</Text>
        <ForwardButton to={`/showtime/${id}/`} text={"showtime"} />
      </Stack>
    </Box>
  )
}
export default ShowtimeCard