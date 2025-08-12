// React, dependencies & packages
import { useEffect, useState } from "react"

// App
import { useAuthContext } from "@/contexts/AuthContext"
import { movieService } from "@/services/movies/movieService"

// Components here


export const useReadMovies = (initialPage = 1, initialPageSize = 5) => {
  const { accessToken } = useAuthContext()
  const [movies, setMovies] = useState({ count: 0, results: [] })
  const [page, setPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [sortField, setSortField] = useState("id")
  const [sortOrder, setSortOrder] = useState("desc")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const readMovies = async (pageNum = page) => {
    try {
      setLoading(true)
      setError(null)
      const orderingParam = sortOrder === "desc" ? `-${sortField}` : sortField
      const response = await movieService.readMoviesStaff(pageNum, pageSize, orderingParam)
      setMovies(response.data)
      console.log("Staff - Read Movies successful:", response.data)
    } catch (error) {
      setError("Something went wrong while reading movies. Please try again.")
      console.error('Staff - Read Movies unsuccessful:', error)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    readMovies(page)
  }, [accessToken, page, pageSize, sortField, sortOrder])

  return { 
    movies,
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
    refetch: readMovies
  }
}