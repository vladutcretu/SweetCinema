// React, dependencies & packages
import { useEffect, useState } from "react"

// App
import { useAuthContext } from "@/contexts/AuthContext"
import { bookingService } from "@/services/tickets/bookingService"

// Components here


export const useReadBookingsManager = (initialPage = 1, initialPageSize = 5) => {
  const { accessToken } = useAuthContext()
  const [bookings, setBookings] = useState({ count: 0, results: [] })
  const [page, setPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [sortField, setSortField] = useState("id")
  const [sortOrder, setSortOrder] = useState("desc")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const readBookingsManager = async (pageNum = page) => {
    setLoading(true)
    setError(null)

    try {
      const orderingParam = sortOrder === "desc" ? `-${sortField}` : sortField
      const response = await bookingService.readBookingsManager(pageNum, pageSize, orderingParam)
      setBookings(response.data)
      console.log("Staff / Manager - Read Bookings successful:", response.data)
    
    } catch (error) {
      if (error.response?.data) {
        const backendErrors = error.response.data
        const errorMessages = Object.values(backendErrors).flat().join("\n")
        setError(`Bookings cannot be loaded: ${errorMessages}`)
      } else {
        setError("Bookings cannot be loaded. Please try again.")
      }
      console.error("Staff / Manager - Bookings unsuccessful:", error)
    
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    readBookingsManager(page)
  }, [accessToken, page, pageSize, sortField, sortOrder])

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
    error 
  }
}