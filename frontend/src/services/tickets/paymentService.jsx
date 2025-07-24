// API
import api from "../Api"

// Components here


export const paymentService = {
  readPayments: () => api.get(`/v1/tickets/payments/`),
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