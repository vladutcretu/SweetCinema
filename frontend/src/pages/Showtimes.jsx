// React, depdencies & packages
import { useState } from "react"
import { format } from "date-fns"
import { enUS } from "date-fns/locale"

//UI
import { Box, Heading, SimpleGrid, Spinner, Tabs, Text } from "@chakra-ui/react"

// App
import { useCityContext } from "@/contexts/CityContext"
import { useGetShowtimesByCity } from "@/hooks/showtimes/useGetShowtimesByCity"
import ShowtimesByDay from "@/components/page-components/ShowtimesPage/ShowtimesByDay"
import ShowtimeCard from "@/components/page-components/ShowtimesPage/ShowtimeCard"

// Components here


const Showtimes = () => {
  const { selectedCityId, selectedCityName } = useCityContext()
  const { showtimes, loading, error } = useGetShowtimesByCity(selectedCityId)
  const groupedShowtimes = ShowtimesByDay(showtimes)
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  // Get current day, format it and set as default state 
  const current_day = new Date()
  const today = format(current_day, "EEEE", {locale: enUS})
  const [selectedDay, setSelectedDay] = useState(today)

  if (loading) return <Spinner />
  if (error) return <Text color="red.400">{error}</Text>

  return (
    <Box px={{ base: 4, md: 8 }} py={6}>
      <Heading mb={6}>Future shows in {selectedCityName} for {selectedDay}</Heading>
      <Tabs.Root 
        lazyMount 
        unmountOnExit 
        size="lg" 
        bg="#4B4E6D" 
        value={selectedDay} 
        onValueChange={(event) => setSelectedDay(event.value)}
      >
        <Tabs.List>
          {days.map((day) => (
            <Tabs.Trigger key={day} value={day}>{day}</Tabs.Trigger>
          ))}
        </Tabs.List>
        <Tabs.Content value={selectedDay}>
          <SimpleGrid
            columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
            spacing={6}
            width="100%"
          >
            {groupedShowtimes[selectedDay]?.length > 0 ? (
              groupedShowtimes[selectedDay].map((showtime) => (
                <ShowtimeCard key={showtime.id} showtime={showtime} movie={showtime.movie} />
              ))
            ) : (
              <Text>No showtimes for {selectedDay}!</Text>
            )}
          </SimpleGrid>
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  )
}
export default Showtimes