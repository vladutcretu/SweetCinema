// React, dependencies & packages
import { useEffect, useState } from "react"

// App
import { useAuthContext } from "@/contexts/AuthContext"
import { paymentService } from "@/services/tickets/paymentService"

// Components here


export const useReadPayments = (initialPage = 1, initialPageSize = 5) => {
  const { accessToken } = useAuthContext()
  const [payments, setPayments] = useState({ count: 0, results: [] })
  const [page, setPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [sortField, setSortField] = useState("id")
  const [sortOrder, setSortOrder] = useState("desc")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const readPayments = async (pageNum = page) => {
    setLoading(true)
    setError(null)
    try {
      const orderingParam = sortOrder === "desc" ? `-${sortField}` : sortField
      const response = await paymentService.readPayments(pageNum, pageSize, orderingParam)
      setPayments(response.data)
      console.log("Staff - Read Payments successful:", response.data)
    } catch (error) {
      setError('Payments cannot be loaded. Please try again!')
      console.error('Staff - Read Payments unsuccessful:', error)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    readPayments(page)
  }, [accessToken, page, pageSize, sortField, sortOrder])

  return { 
    payments,
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