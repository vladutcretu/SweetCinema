// UI
import { Box, Text, Heading, SimpleGrid, Spinner } from "@chakra-ui/react"

// App
import { useCityContext } from "@/contexts/CityContext"
import { useReadMovies } from "@/hooks/movies/movie/useReadMovies"
import MovieCard from "./MovieCard"

// Components here

const MoviesGrid = () => {
  const { selectedCityId } = useCityContext()
  const { movies, loading: moviesLoading, error: moviesError } = useReadMovies(selectedCityId)

  if (moviesLoading) return <Spinner />
  if (moviesError) return <Text color="red.400">{moviesError}</Text>
  if (movies.length === 0) return <Text>Currently there's no movies to show.</Text>

  return (
    <Box px={{ base: 4, md: 8 }} py={6}>
      <Heading mb={6}>Newest Movies</Heading>

      <SimpleGrid
        columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
        spacing={6}
        width="100%"
      >
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
          />
        ))}
      </SimpleGrid>
    </Box>
  )
}
export default MoviesGrid