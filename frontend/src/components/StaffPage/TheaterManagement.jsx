// React, dependencies & packages
import { useState } from 'react'

// UI
import { Center, Field, Heading, Input } from '@chakra-ui/react'

// App
import { useCreateTheater } from '@/hooks/locations/useCreateTheater'
import { useReadTheaters } from '@/hooks/locations/useReadTheaters'
import { useUpdateTheater } from '@/hooks/locations/useUpdateTheater'
import { useDeleteTheater } from '@/hooks/locations/setDeleteTheater'
import { useReadCities } from '@/hooks/locations/useReadCities'
import useSearchBar from '@/hooks/useSearchBar'
import SearchBar from '../common/SearchBar'
import SubmitButton from '../common/SubmitButton'
import ReusableTable from '../common/ReusableTable'
import FormWrapper from '../common/FormWrapper'
import useFormState from '@/hooks/useFormState'

// Write components here


const TheaterManagement = () => {
  const { createTheater, loading: loadingCreateTheater, error: errorCreateTheater } = useCreateTheater()
  const { cities, loading: loadingCities, error: errorCities, refetch: readCities } = useReadCities()
  const { theaters, loading: loadingTheaters, error: errorTheaters, refetch: readTheaters } = useReadTheaters()
  const { updateTheater, loading: loadingUpdateTheater, error: errorUpdateTheater } = useUpdateTheater()
  const { deleteTheater, loading: loadingDeleteTheater, error: errorDeleteTheater } = useDeleteTheater()
  const { searchTerm, handleChangeSearch, filteredData: filteredTheaters } = useSearchBar(theaters, "name")

  // Create theater
  const { 
    formData: theaterCreateForm, 
    setFormData: setTheaterCreateForm, 
    handleChange: handleChangeCreate, 
    resetForm: resetCreateForm 
  } = useFormState({ name: "", city: "", rows: "", columns: "" })

  const handleCityChangeCreate = (event) => {
    const selected = event.target.value
    setTheaterCreateForm(prev => ({ ...prev, city: selected }))
  }

  const handleSubmitCreate = async (event) => {
    event.preventDefault()
    const result = await createTheater(
      theaterCreateForm.name, 
      theaterCreateForm.city, 
      theaterCreateForm.rows,
      theaterCreateForm.columns
    )
    if (result) {
      resetCreateForm()
      await readTheaters()
    }
  }

  // Read theaters
  const columns = [
    { key: "id", title: "ID" },
    { key: "city", title: "City" },
    { key: "name", title: "Name" },
    { key: "r-c", title: "Rows-Columns" }
  ]
  const renderCell = (theater, column) => {
    switch (column.key) {
      case "id": return theater.id
      case "city": return theater.city.name
      case "name": return theater.name
      case "r-c": return `R${theater.rows}-C${theater.columns}`
    }
  }
  const renderActions = (theater) => (
    <>
    <SubmitButton
      onClick={() => handleStartUpdate(theater)}
      loading={loadingUpdateTheater}
      text={"Update"}
    />
    <SubmitButton 
      onClick={() => handleDelete(theater.id)}
      loading={loadingDeleteTheater}
      text={"Delete"}
    />
    </>
  )

  // Update theater
  const [isUpdating, setIsUpdating] = useState(false)
  const [theaterToUpdate, setTheaterToUpdate] = useState(null)
  const [theaterId, setTheaterId] = useState("")
  const { 
    formData: updatedForm, 
    setFormData: setUpdatedForm, 
    handleChange: handleChangeUpdate, 
    resetForm: resetUpdatedForm 
  } = useFormState({ name: "", rows: "", columns: "" })

  const handleStartUpdate = (theater) => {
    setIsUpdating(true)
    setTheaterToUpdate(theater)
    setTheaterId(theater.id)
    setUpdatedForm({ 
      name: theater.name, 
      rows: theater.rows, 
      columns: theater.columns 
    })
  }

  const handleSubmitUpdate = async (event) => {
    event.preventDefault()
    const result = await updateTheater(
      theaterId, 
      updatedForm.name,
      updatedForm.rows,
      updatedForm.columns
    )
    if (result) {
      setIsUpdating(false)
      setTheaterToUpdate(null)
      setTheaterId("")
      resetUpdatedForm()
      await readTheaters()
    }
  }
 
  // Delete theater
  const handleDelete = async (theaterId) => {
    const result = await deleteTheater(theaterId)
    if (result) return await readTheaters()
  }

  return (
    <>
      <Center><Heading size="xl">Theater Management</Heading></Center>

      {/* Search Bar */}
      <SearchBar value={searchTerm} onChange={handleChangeSearch} text={"name"} />

      {/* Theater table & Update/Delete instance */}
      <ReusableTable
        loading={loadingTheaters}
        error={errorTheaters}
        additionalErrors={[errorUpdateTheater, errorDeleteTheater].filter(Boolean)}
        data={filteredTheaters}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        noDataMessage="No theaters found!"
      />

      {/* Create theater */}
      <FormWrapper
        title={"Add Theater"}
        onSubmit={handleSubmitCreate}
        submitText={"Add Theater"}
        loading={loadingCreateTheater}
        error={errorCreateTheater}
      >
          <Field.Label>Name:</Field.Label>
          <Input 
            type="text"
            name="name"
            value={theaterCreateForm.name}
            onChange={handleChangeCreate}
            bg="white"
            color="black"
            size="xs"
            placeholder="Type name..."
            required
          />
          <Field.Label>City:</Field.Label>
            <select name="city" value={theaterCreateForm.city} onChange={handleCityChangeCreate} required>
              <option value="" disabled>Select city</option>
              {cities.map(city => (<option key={city.id} value={city.name}>{city.name}</option>))}
            </select>

          <Field.Label>Rows:</Field.Label>
          <Input 
            type="number"
            name="rows"
            value={theaterCreateForm.rows}
            onChange={handleChangeCreate}
            bg="white"
            color="black"
            size="xs"
            required
            min={1}
            max={10}
          />
          <Field.Label>Columns:</Field.Label>
          <Input 
            type="number"
            name="columns"
            value={theaterCreateForm.columns}
            onChange={handleChangeCreate}
            bg="white"
            color="black"
            size="xs"
            required
            min={1}
            max={10}
          />
      </FormWrapper>


      {/* Update theater */}
      {isUpdating && (
        <FormWrapper
          title={"Update Theater"}
          onSubmit={handleSubmitUpdate}
          submitText={"Update Theater"}
          loading={loadingUpdateTheater}
          error={errorUpdateTheater}
        >
          <Field.Label>New Name for {theaterToUpdate.name}:</Field.Label>
          <Input 
            type="text"
            name="name"
            value={updatedForm.name}
            onChange={handleChangeUpdate}
            bg="white"
            color="black"
            size="xs"
            placeholder="Type name..."
          />
          <Field.Label>New value for {theaterToUpdate.rows} rows:</Field.Label>
          <Input 
            type="number"
            name="rows"
            value={updatedForm.rows}
            onChange={handleChangeUpdate}
            bg="white"
            color="black"
            size="xs"
            min={1}
            max={10}
          />
          <Field.Label>New value for {theaterToUpdate.columns} columns:</Field.Label>
          <Input 
            type="number"
            name="columns"
            value={updatedForm.columns}
            onChange={handleChangeUpdate}
            bg="white"
            color="black"
            size="xs"
            min={1}
            max={10}
          />
      </FormWrapper>
      )}
    </>
  )
}
export default TheaterManagement