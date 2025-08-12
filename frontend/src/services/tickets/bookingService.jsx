// API
import api from "../Api"

// Components here


export const bookingService = {
  readBookings: (page = 1, pageSize = 5, ordering = "booked_at") => api.get(`/v1/tickets/bookings/`, {
    params: { page, page_size: pageSize, ordering }
  }),
  readBookingsManager: (page = 1, pageSize = 5, ordering = "-id") => api.get(`/v1/tickets/bookings/`, {
    params: { staff: true, page, page_size: pageSize, ordering }
  }),
  readBookingsCashier: (cashierCityId, page = 1, pageSize = 5, ordering = "-id") => api.get(`/v1/tickets/bookings/`, {
      params: { staff: true, city: cashierCityId, page, page_size: pageSize, ordering }
  }),
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