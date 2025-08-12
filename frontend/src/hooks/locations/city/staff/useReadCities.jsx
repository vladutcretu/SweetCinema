// React, dependencies & packages
import { useEffect, useState } from "react"

// App
import { useAuthContext } from "@/contexts/AuthContext"
import { cityService } from "@/services/locations/cityService"

// Components here


export const useReadCities = (initialPage = 1, initialPageSize = 5) => {
  const { accessToken } = useAuthContext()
  const [cities, setCities] = useState({ count: 0, results: [] })
  const [page, setPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [sortField, setSortField] = useState("name")
  const [sortOrder, setSortOrder] = useState("asc")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const readCities = async (pageNum = page) => {
    try {
      setLoading(true)
      setError(null)
      const orderingParam = sortOrder === "desc" ? `-${sortField}` : sortField
      const response = await cityService.readCitiesManager(pageNum, pageSize, orderingParam)
      setCities(response.data)
      console.log("Staff - Read Cities successful:", response.data)
    } catch (error) {
      setError('Something went wrong while reading cities. Please try again.')
      console.error('Staff - Read Cities unsuccessful:', error)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    readCities(page)
  }, [accessToken, page, pageSize, sortField, sortOrder])

  return { 
    cities,
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
    refetch: readCities 
  }
}