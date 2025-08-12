// API
import api from "../Api"

// Components here


export const paymentService = {
  readPayments: (page = 1, pageSize = 5, ordering = "-id") => api.get(`/v1/tickets/payments/`, {
    params: { page, page_size: pageSize, ordering }
  }),
  createPayment: (
    bookingIds, 
    paymentAmount, 
    paymentMethod
  ) => api.post(`/v1/tickets/payments/`, 
  { 
    booking_ids: bookingIds, 
    amount: paymentAmount, 
    method: paymentMethod 
  }),
}