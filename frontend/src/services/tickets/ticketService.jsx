// API
import api from "../Api"

// Components here


export const ticketService = {
  // Showtime page
  postTicketReserve: (showtimeId, seatIds) => api.post(`/tickets/reserve/`, { 
    showtime_id: showtimeId, 
    seat_ids: seatIds 
  }),
  postTicketPurchase: (showtimeId, seatIds) => api.post(`/tickets/purchase/`, { 
    showtime_id: showtimeId, 
    seat_ids: seatIds 
  }),

  // Payment page
  getPaymentBookings: (bookingIds) => api.post(`/tickets/pay/bookings/`, { 
    booking_ids: bookingIds 
  }),
  putPaymentTimeout: (bookingIds) => api.put(`/tickets/pay/timeout/`, {
    booking_ids: bookingIds
  }),
  postPaymentComplete: (bookingIds, paymentAmount, paymentMethod) => api.post(`/tickets/pay/`, { 
    booking_ids: bookingIds, 
    amount: paymentAmount, 
    method: paymentMethod 
  }),

  // UserProfile page
  getUserBookingHistory: () => api.get(`/tickets/bookings/history/`),
  updateUserCancelBooking: (bookingId) => api.patch(`/tickets/booking/${bookingId}/cancel/`, {
    status: "canceled", 
    expires_at: null
  })
}