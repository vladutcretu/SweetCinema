// React, dependencies & packages
import { useEffect, useState } from "react"

// App
import { useAuthContext } from "@/contexts/AuthContext"
import { bookingService } from "@/services/tickets/bookingService"

// Components here


export const useReadBookings = (initialPage = 1, initialPageSize = 5) => {
  const { accessToken } = useAuthContext()
  const [bookings, setBookings] = useState({ count: 0, results: [] })
  const [page, setPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [sortField, setSortField] = useState("booked_at")
  const [sortOrder, setSortOrder] = useState("desc")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const readBookings = async (pageNum = page) => {
    setLoading(true)
    setError(null)
    
    try {
      const orderingParam = sortOrder === "desc" ? `-${sortField}` : sortField
      const response = await bookingService.readBookings(pageNum, pageSize, orderingParam)
      setBookings(response.data)
      console.log("User - Read Booking History successful:", response.data)
    
    } catch (error) {
      if (error.response?.data) {
        const backendErrors = error.response.data
        const errorMessages = Object.values(backendErrors).flat().join("\n")
        setError(`Something went wrong while getting bookings history: ${errorMessages}`)
      } else {
        setError("Something went wrong while getting bookings history. Please try again.")
      }
      console.error("User - Read Booking History unsuccessful:", error)
    
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!accessToken) return
    readBookings(page)
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
    error, 
    refetch: readBookings 
  }
}