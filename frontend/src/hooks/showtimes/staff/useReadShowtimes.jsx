// React, dependencies & packages
import { useEffect, useState } from "react"

// App
import { useAuthContext } from "@/contexts/AuthContext"
import { showtimeService } from "@/services/showtimes/showtimeService"

// Components here


export const useReadShowtimes = (initialPage = 1, initialPageSize = 5) => {
  const { accessToken } = useAuthContext()
  const [showtimes, setShowtimes] = useState({ count: 0, results: [] })
  const [page, setPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [sortField, setSortField] = useState("id")
  const [sortOrder, setSortOrder] = useState("desc")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const readShowtimes = async (pageNum = page) => {
    try {
      setLoading(true)
      setError(null)
      const orderingParam = sortOrder === "desc" ? `-${sortField}` : sortField
      const response = await showtimeService.readShowtimes(pageNum, pageSize, orderingParam)
      setShowtimes(response.data)
      console.log("Staff - Read Showtimes successful:", response.data)
    } catch (error) {
      setError('Showtimes cannot be loaded. Please try again!')
      console.error('Staff - Read Showtimes unsuccessful:', error)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    readShowtimes(page)
  }, [accessToken, page, pageSize, sortField, sortOrder])

  return { 
    showtimes,
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
    refetch: readShowtimes 
  }
}