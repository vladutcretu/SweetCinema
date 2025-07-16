// API
import api from "../Api"

// Components here


export const bookingService = {
  // User: Profile page
  getBookingHistory: () => api.get(`/tickets/bookings/history/`),
  patchBookingCancel: (bookingId) => api.patch(`/tickets/booking/${bookingId}/cancel/`, {
    status: "canceled", 
    expires_at: null
  }),

  // Staff: Read & Update
  readBookings: () => api.get(`/tickets/bookings/`),
  readBookingsCashier: (userCity) => api.get(`/tickets/booking/cashier/?city=${userCity}`),
  updateBookingCashier: (bookingId) => api.patch(`/tickets/bookings/cashier/${bookingId}/`, { status: "purchased" }),
}