// API
import api from "../Api"

// Components here


export const paymentService = {
  // Staff: Read
  readPayments: () => api.get(`/tickets/payments/`),
}