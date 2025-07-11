// API
import api from "../Api"

// Components here


export const ticketService = {
  postTicketReserve: (showtimeId, seatIds) => api.post(`/tickets/reserve/`, { showtime_id: showtimeId, seat_ids: seatIds }),
  postTicketPurchase: (showtimeId, seatIds) => api.post(`/tickets/purchase/`, { showtime_id: showtimeId, seat_ids: seatIds }),
}