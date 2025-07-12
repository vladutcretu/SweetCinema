// API
import api from "../Api"

// Components here


export const ticketService = {
  postTicketReserve: (showtimeId, seatIds) => api.post(`/tickets/reserve/`, { 
    showtime_id: showtimeId, 
    seat_ids: seatIds 
  }),
  postTicketPurchase: (showtimeId, seatIds) => api.post(`/tickets/purchase/`, { 
    showtime_id: showtimeId, 
    seat_ids: seatIds 
  }),
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
}