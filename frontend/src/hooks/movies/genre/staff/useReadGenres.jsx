// React, dependencies & packages
import { useEffect, useState } from "react"

// App
import { useAuthContext } from "@/contexts/AuthContext"
import { genreService } from "@/services/movies/genreService"

// Components here


export const useReadGenres = (initialPage = 1, initialPageSize = 5) => {
  const { accessToken } = useAuthContext()
  const [genres, setGenres] = useState({ count: 0, results: [] })
  const [page, setPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [sortField, setSortField] = useState("name")
  const [sortOrder, setSortOrder] = useState("asc")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const readGenres = async (pageNum = page) => {
    try {
      setLoading(true)
      setError(null)
      const orderingParam = sortOrder === "desc" ? `-${sortField}` : sortField
      const response = await genreService.readGenres(pageNum, pageSize, orderingParam)
      setGenres(response.data)
      console.log("Staff - Read Genres successful:", response.data)
    } catch (error) {
      setError('Genres cannot be loaded. Please try again!')
      console.error('Staff - Read Genres unsuccessful:', error)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    readGenres(page)
  }, [accessToken, page, pageSize, sortField, sortOrder])

  return { 
    genres,
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
    refetch: readGenres 
  }
}