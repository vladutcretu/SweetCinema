// React, depedencies & packages
import { useState } from "react"

// Components here 


const useSearchBar = (data, searchKey) => {
  const [searchTerm, setSearchTerm] = useState("")

  const handleChangeSearch = (event) => {
    setSearchTerm(event.target.value)
  }

  const filteredData = data?.filter(item => 
    item[searchKey]?.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  return { searchTerm, handleChangeSearch, filteredData }
}
export default useSearchBar