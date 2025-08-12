// React, dependencies & packages
import { useEffect, useState } from "react"

// App
import { useAuthContext } from "@/contexts/AuthContext"
import { theaterService } from "@/services/locations/theaterService"

// Components here


export const useReadTheaters = (initialPage = 1, initialPageSize = 5) => {
  const { accessToken } = useAuthContext()
  const [theaters, setTheaters] = useState({ count: 0, results: [] })
  const [page, setPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [sortField, setSortField] = useState("city")
  const [sortOrder, setSortOrder] = useState("asc")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const readTheaters = async (pageNum = page) => {
    setLoading(true)
    setError(null)

    try {
      const orderingParam = sortOrder === "desc" ? `-${sortField}` : sortField
      const response = await theaterService.readTheaters(pageNum, pageSize, orderingParam)
      setTheaters(response.data)
      console.log("Staff - Read Theaters successful:", response.data)

    } catch (error) {
      if (error.response?.data) {
        const backendErrors = error.response.data
        const errorMessages = Object.values(backendErrors).flat().join("\n")
        setError(`Something went wrong while reading theaters: ${errorMessages}`)
      } else {
        setError("Something went wrong while reading theaters. Please try again.")
      }
      console.error('Staff - Read Theaters unsuccessful:', error)

    } finally {
      setLoading(false)
    }
  }
    
  useEffect(() => {
    readTheaters(page)
  }, [accessToken, page, pageSize, sortField, sortOrder])

  return { 
    theaters, 
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
    refetch: readTheaters
  }
}