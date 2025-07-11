// React, dependencies & packages
import { Link } from "react-router-dom"

// UI
import { Box, Image, Text, Heading, Button, Stack } from "@chakra-ui/react"

// Components here


function MovieCard({ movie }) {
  const { id, poster, title, genres } = movie
  const genreText = genres?.length > 0 ? genres.map(genre => genre.name).join(", ") : "No genres"

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

      <Stack spacing={2} p={4} flex="1">
        <Heading size="md" noOfLines={1}>
          {title}
        </Heading>
        <Text fontSize="sm" noOfLines={2}>
          {genreText}
        </Text>

        <Button
          as={Link}
          to={`/movie/${id}/`}
          mt="auto"
          size="sm"
          colorScheme="teal"
          variant="outline"
          alignSelf="start"
        >
          See showtimes
        </Button>
      </Stack>
    </Box>
  )
}
export default MovieCard