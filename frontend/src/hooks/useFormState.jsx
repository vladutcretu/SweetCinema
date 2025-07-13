// React, depedencies & packages
import { useState } from "react"

// Components here 


const useFormState = (initialState) => {
  const [formData, setFormData] = useState(initialState)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const resetForm = () => setFormData(initialState)

  return { formData, setFormData, handleChange, resetForm }
}
export default useFormState