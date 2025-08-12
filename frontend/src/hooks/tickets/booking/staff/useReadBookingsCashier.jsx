// React, dependencies & packages
import { useEffect, useState } from "react"

// App
import { useAuthContext } from "@/contexts/AuthContext"
import { bookingService } from "@/services/tickets/bookingService"

// Components here


export const useReadBookingsCashier = (cashierCity, initialPage = 1, initialPageSize = 5) => {
  const { accessToken } = useAuthContext()
  const [bookings, setBookings] = useState({ count: 0, results: [] })
  const [page, setPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [sortField, setSortField] = useState("id")
  const [sortOrder, setSortOrder] = useState("asc")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const readBookingsCashier = async (cashierCity, pageNum = page) => {
    setLoading(true)
    setError(null)
    try {
      const orderingParam = sortOrder === "desc" ? `-${sortField}` : sortField
      const response = await bookingService.readBookingsCashier(cashierCity, pageNum, pageSize, orderingParam)
      setBookings(response.data)
      console.log("Staff / Cashier - Read Bookings Cashier successful:", response.data)
    } catch (error) {
      setError('Bookings for Cashier cannot be loaded. Please try again!')
      console.error('Staff / Cashier - Read Bookings Cashier unsuccessful:', error)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    readBookingsCashier(cashierCity, page)
  }, [accessToken, cashierCity, page, pageSize, sortField, sortOrder])

  return { 
    bookings,
    page,
    setPage,
    pageSize,
    setPageSize,
    sortField, 
    setSortField,
    sortOrder, 
    setSortOrder, 
    loading, 
    error, 
    refetch: readBookingsCashier 
  }
}