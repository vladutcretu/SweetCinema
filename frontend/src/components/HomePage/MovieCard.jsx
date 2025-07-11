// UI
import { Box, Image, Heading, Stack, Badge } from "@chakra-ui/react"
import ForwardButton from "../common/ForwardButton"

// Components here


function MovieCard({ movie }) {
  const { id, poster, title, genres } = movie

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
      <Box position="relative" aspectRatio={2 / 3} width="100%">
        <Image
          src={poster}
          alt={`${title} poster`}
          objectFit="cover"
          width="100%"
          height="100%"
          fallbackSrc="favicon.png"
        />
      </Box>

      {/* Movie Details */}
      <Stack spacing={2} p={4} flex="1">
        <Heading size="md" noOfLines={1}>{title}</Heading>
        <Stack direction="row" wrap="wrap">
          {genres.map((genre) => (
            <Badge key={genre.id} colorScheme="teal" variant="subtle">{genre.name}</Badge>
          ))}
        </Stack>
        <ForwardButton to={`/movie/${id}/`} text={"movie"} />
      </Stack>
    </Box>
  )
}
export default MovieCard