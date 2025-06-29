// React, dependencies & packages
import React, { useState, useEffect } from 'react'

// App
import { useAuthContext } from '../../contexts/AuthContext'
const api_url = import.meta.env.VITE_API_URL

// Write components here


const PaymentManagement = () => {
  // Get context for access
  const { accessToken } = useAuthContext()

  // Fetch payment data
  const [payments, setPayments] = useState([])
    
  // Get payment list
  const getPaymentList = async() => {
    try {
      const response = await fetch(`${api_url}/tickets/payments/`, {
        method: 'GET',
        headers: {'Authorization': `Bearer ${accessToken}`}
      })
      if (!response.ok) {
        throw new Error (`HTTP error! Response status: ${response.status}`)
      } else {
        const data = await response.json()
        console.log(data)
        setPayments(data)
      }
    } catch (error) {
      console.error('Fetching User error', error)
    }
  }

  useEffect(() => {
        getPaymentList()
    }, [])

  return (
    <>
    <div style={{ backgroundColor: "#228B22" }}>
      <h3>PaymentManagement</h3>
      <table style={{ border: "1px solid black", width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>User ID</th>
            <th>Booking ID</th>
            <th>Amount</th>
            <th>Method</th>
            <th>Status</th>
            <th>Paid time</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id}>
              <td>{payment.id}</td>
              <td>{payment.user}</td>
              <td>{payment.booking}</td>
              <td>{payment.amount}</td>
              <td>{payment.method}</td>
              <td>{payment.status}</td>
              <td>Paid on {payment.paid_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  )
}

export default PaymentManagement
