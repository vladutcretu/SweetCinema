// UI
import { Box, Text, SimpleGrid, Badge, Spinner, Heading, Checkbox } from "@chakra-ui/react"

// App
import { useAuthContext } from "@/contexts/AuthContext"
import { useReadShowtimeSeats } from "@/hooks/showtimes/useReadShowtimeSeats"
import { useShowtimeSeatSelect } from "@/hooks/showtimes/useShowtimeSeatSelect"
import ShowtimeTicket from "./ShowtimeTicket"


// Components here


const ShowtimeSeats = ({ showtimeId, theaterColumns, showtimeStart }) => {
  const { isAuthenticated } = useAuthContext()
  const { 
    showtimeSeats, 
    loading: showtimeSeatsLoading, 
    error: showtimeSeatsError, 
    refetch: updateShowtimeSeats 
  } = useReadShowtimeSeats(showtimeId)
  const { selectedSeats, toggleSeat, selectedSeatIds, setSelectedSeats } = useShowtimeSeatSelect()
  // Get current datetime + 30 mintes to compare with showtime starts_at datetime
  const now = new Date()
  const showtimeTimestamp = new Date(showtimeStart).getTime()
  const nowPlus30 = now.getTime() + 30 * 60 * 1000
  const isStillAllowed = showtimeTimestamp > nowPlus30
  // Seat box bgcolor
  const statusColors = {
    available: "green.500",
    reserved: "orange.500",
    purchased: "red.500",
}

  if (showtimeSeatsLoading) return <Spinner />
  if (showtimeSeatsError) return <Text color="red.400">{showtimeSeatsError}</Text>

  return (
    <Box mt={10}>
      <Heading size="lg" mb={4}>Seats</Heading>

      {/* Seat Detail */}
      {showtimeSeats.length === 0 ? (
        <Text>No seats available.</Text>
      ) : (
        <SimpleGrid columns={theaterColumns} spacing={2}>
          {showtimeSeats.map((seat) => (
            <Box
              key={seat.id}
              bg={statusColors[seat.status] || "#4B4E6D"}
              p={2}
              minW="70px"
              minH="70px"
              borderWidth="1px"
              borderRadius="md"
              textAlign="center"
            >
              {/* <Text fontSize="sm" fontWeight="bold">#{seat.id}</Text> */}
              <Text fontSize="sm" fontWeight="bold">R{seat.row} C{seat.column}</Text>
              <Badge mt={1} fontSize="0.7em">{seat.status}</Badge><br />
              {/* Seat select */}
              {seat.status === "available" && (
                <Checkbox.Root 
                  variant="solid" 
                  checked={selectedSeats.some(s => s.id === seat.id)} 
                  onCheckedChange={() => toggleSeat(seat)}
                > 
                  <Checkbox.HiddenInput />
                  <Checkbox.Control bg="#FFFFFF" />
                  <Checkbox.Label>Select seat</Checkbox.Label>
                </Checkbox.Root>
              )}
            </Box>
          ))}
        </SimpleGrid>
      )}

      {/* Ticket reserve/purchase section */}
      {selectedSeats.length > 0 && (
        <Box bg="#4B4E6D" mt={10}>
          <Text>Selected seats: {" "} {selectedSeats.map(s => `R${s.row}C${s.column}`).join(", ")}</Text>
          {isAuthenticated ? ( 
            <ShowtimeTicket 
              showtimeId={showtimeId} 
              seatIds={selectedSeatIds}
              allowed={isStillAllowed}
              onSuccess={() => {
                updateShowtimeSeats()
                setSelectedSeats([])
              }}
            />
          ) : (
            <Text>To reserve or buy a ticket for selected seats please Log In.</Text>
          )}
        </Box>
      )}
    </Box>
  )
}
export default ShowtimeSeats