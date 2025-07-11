// UI
import { Box, Text, SimpleGrid, Badge, Spinner, Heading } from "@chakra-ui/react"

// App
import { useAuthContext } from "@/contexts/AuthContext"
import { useGetShowtimeSeats } from "@/hooks/showtimes/useGetShowtimeSeats"
import TicketReserve from "../TicketReserve"
import TicketPay from "../TicketPay"
import ShowtimeTicket from "./ShowtimeTicket"

const statusColors = {
  available: "green.500",
  reserved: "orange.500",
  purchased: "red.500",
};

const ShowtimeSeats = ({ showtimeId, columns }) => {
  const { showtimeSeats, loading: showtimeSeatsLoading, error: showtimeSeatsError } = useGetShowtimeSeats(showtimeId)

  if (showtimeSeatsLoading) {
    return <Spinner />
  }

  if (showtimeSeatsError) {
    return <Text color="red.400">An error occurred: {showtimeSeatsError}</Text>
  }

  return (
    <Box mt={10}>
      <Heading size="lg" mb={4}>Seats</Heading>

      {showtimeSeats.length === 0 ? (
        <Text>No seats available.</Text>
      ) : (
        <SimpleGrid columns={columns} spacing={2}>
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
              <Badge mt={1} fontSize="0.7em">{seat.status}</Badge>
              {seat.status === "available" && <ShowtimeTicket seatId={seat.id}/>}
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Box>
  )
}
export default ShowtimeSeats