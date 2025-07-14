// React, dependencies & packages
import { useState } from "react"

// App
import { userService } from "@/services/users/userService"

// Components here


export const useSetCashierCity = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const setCashierCity = async (userId, city) => {
    setLoading(true)
    setError(null)
    try {
      const response = await userService.setCashierCity(userId, city)
      setData(response.data)
      alert(`✅ Cashier city updated to ${city}!`)
      console.log("Update Cashier City successful:", response.data)
      return response.data
    } catch (error) {
      setError("Something went wrong while updating user group. Please try again.")
      alert(`❌ Cashier City do not updated!`)
      console.error("Update Cashier City unsuccessful:", error)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { setCashierCity, loading, error, data }
}