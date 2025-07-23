// API
import api from "../Api"

// Components here


export const bookingService = {
  readBookings: () => api.get(`/v1/tickets/bookings/`),
  readBookingsManager: () => api.get(`/v1/tickets/bookings/?staff=true`),
  readBookingsCashier: (cashierCityId) => api.get(`/v1/tickets/bookings/?staff=true&city=${cashierCityId}`),
  updateBooking: (bookingId) => api.patch(`/v1/tickets/bookings/${bookingId}/`, { status: "canceled" }),
  updateBookingCashier: (bookingId) => api.patch(`/v1/tickets/bookings/${bookingId}/?staff=true`, { status: "purchased" }),
}