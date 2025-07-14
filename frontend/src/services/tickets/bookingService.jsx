// API
import api from "../Api"

// Components here


export const bookingService = {
  // Staff: Read
  readBookings: () => api.get(`/tickets/bookings/`),
}