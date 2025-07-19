// React, depedencies & packages
import { useParams } from "react-router-dom"

// UI
import { Box, Heading, Text, Stack, Image, Badge, SimpleGrid, Spinner } from "@chakra-ui/react"

// App
import { useReadMovie } from "@/hooks/movies/movie/useReadMovie"
import MovieShowtimes from "./MovieShowtimes"
import BackButton from "@/components/common/BackButton"
import { useCityContext } from "@/contexts/CityContext"

// Components here


const MoviePresentation = () => {
  const { movieId } = useParams()
  const { selectedCityId } = useCityContext()
  const { movie, loading: movieLoading, error: movieError } = useReadMovie(movieId)

  if (movieLoading) return <Spinner />
    
  if (movieError) return <Text color="red.400">{movieError}</Text>

  return (
    <Box px={{ base: 4, md: 10 }} py={10} maxW="7xl" mx="auto">
      <Heading mb={6}>Movie</Heading>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
        {/* Movie Poster */}
        <Box>
          <Image
            src={movie.poster}
            alt={`${movie.title} poster`}
            borderRadius="lg"
            objectFit="cover"
            w="100%"
            maxH="700px"
          />
        </Box>

        {/* Movie Details */}
        <Stack spacing={4} bg={"#7B7E82"} p={6} borderRadius="lg" shadow="md">
          <Heading size="2xl">{movie.title}</Heading>

          {/* Genres */}
          <Stack direction="row" wrap="wrap">
            {movie.genres.map((genre) => (
              <Badge key={genre.id} colorScheme="teal" variant="subtle">{genre.name}</Badge>
            ))}
          </Stack>

          {/* Info Grid */}
          <SimpleGrid columns={{ base: 1, sm: 2 }} spacingY={2} spacingX={6}>
            <Text><b>Release Date:</b> {movie.release}</Text>
            <Text><b>Duration:</b> {movie.duration}</Text>
            <Text><b>Language:</b> {movie.language}</Text>
            <Text><b>Parental Guide:</b> {movie.parental_guide}</Text>
          </SimpleGrid>

          {/* Cast */}
          <Box>
            <Text><b>Director:</b> {movie.director}</Text>
            {/* <Text><b>Cast:</b> {movie.cast.join(", ")}</Text> */}
            <Text><b>Cast:</b> {movie.cast}</Text>
          </Box>

          {/* Description */}
          <Box>
            <Text fontWeight="bold" mb={1}>Description:</Text>
            <Text>{movie.description}</Text>
          </Box>


          {/* Showtimes section */}
          <MovieShowtimes 
            movieId={movieId}
            cityId={selectedCityId}
          />

          {/* Back to movie list button */}
          <BackButton
            to={"/"}
            text={"home"}
          />
        </Stack>
      </SimpleGrid>
    </Box>
  )
}
export default MoviePresentation