// React, dependencies & packages
import { useEffect, useState } from "react"

// App
import { useAuthContext } from "@/contexts/AuthContext"
import { userService } from "@/services/users/userService"

// Components here


export const useReadUsers = (initialPage = 1, initialPageSize = 5) => {
  const { accessToken } = useAuthContext()
  const [users, setUsers] = useState({ count: 0, results: [] })
  const [page, setPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [sortField, setSortField] = useState("id")
  const [sortOrder, setSortOrder] = useState("desc")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const readUsers = async (pageNum = page) => {
    setLoading(true)
    setError(null)
    
    try {
      const orderingParam = sortOrder === "desc" ? `-${sortField}` : sortField
      const response = await userService.readUsers(pageNum, pageSize, orderingParam)
      setUsers(response.data)
      console.log("Staff - Read Users successful:", response.data)
      return response.data
    
    } catch (error) {
      if (error.response?.data) {
        const backendErrors = error.response.data
        const errorMessages = Object.values(backendErrors).flat().join("\n")
        setError(`Something went wrong while reading users: ${errorMessages}`)
      } else {
        setError("Something went wrong while reading users. Please try again.")
      }
      console.error("Staff - Read Users unsuccessful:", error)
      return null
    
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    readUsers(page)
  }, [accessToken, page, pageSize, sortField, sortOrder])

  return { 
    users,
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
    refetch: readUsers 
  }
}