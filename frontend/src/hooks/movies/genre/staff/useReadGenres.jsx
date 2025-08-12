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
    setLoading(true)
    setError(null)

    try {
      const orderingParam = sortOrder === "desc" ? `-${sortField}` : sortField
      const response = await genreService.readGenres(pageNum, pageSize, orderingParam)
      setGenres(response.data)
      console.log("Staff - Read Genres successful:", response.data)

    } catch (error) {
      if (error.response?.data) {
        const backendErrors = error.response.data
        const errorMessages = Object.values(backendErrors).flat().join("\n")
        setError(`Something went wrong while reading genres: ${errorMessages}`)
      } else {
        setError("Something went wrong while reading genres. Please try again.")
      }
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