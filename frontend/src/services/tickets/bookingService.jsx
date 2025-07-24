// API
import api from "../Api"

// Components here


export const bookingService = {
  readBookings: () => api.get(`/v1/tickets/bookings/`),
  readBookingsManager: () => api.get(`/v1/tickets/bookings/?staff=true`),
  readBookingsCashier: (cashierCityId) => api.get(`/v1/tickets/bookings/?staff=true&city=${cashierCityId}`),
  createBooking: (showtimeId, seatIds, status) => api.post(`v1/tickets/bookings/`, { 
    showtime_id: showtimeId, 
    seat_ids: seatIds,
    status: status
  }),
  readPaymentBookings: (bookingIds) => api.post(`v1/tickets/bookings/payments/`, { 
    booking_ids: bookingIds 
  }),
  updateBooking: (bookingId) => api.patch(`/v1/tickets/bookings/${bookingId}/`, { status: "canceled" }),
  updateBookingTimeout: (bookingIds) => api.patch(`/v1/tickets/bookings/mark-failed/`, {
    booking_ids: bookingIds
  }),
  updateBookingCashier: (bookingId) => api.patch(`/v1/tickets/bookings/${bookingId}/?staff=true`, { status: "purchased" }),
}