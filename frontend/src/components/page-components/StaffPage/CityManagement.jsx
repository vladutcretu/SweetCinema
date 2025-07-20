// React, dependencies & packages
import { useState } from 'react'

// UI
import { Center, Field, Heading, Input } from '@chakra-ui/react'

// App
import { useCreateCity } from '@/hooks/locations/city/staff/useCreateCity'
import { useReadCities } from '@/hooks/locations/city/staff/useReadCities'
import { useUpdateCity } from '@/hooks/locations/city/staff/useUpdateCity'
import { useDeleteCity } from '@/hooks/locations/city/staff/useDeleteCity'
import useSearchBar from '@/hooks/useSearchBar'
import SubmitButton from '@/components/common/SubmitButton'
import SearchBar from '@/components/common/SearchBar'
import ReusableTable from '@/components/common/ReusableTable'
import FormWrapper from '@/components/common/FormWrapper'
import useFormState from '@/hooks/useFormState'
import { formatDate, formatTime } from '@/utils/DateTimeFormat'

// Write components here


const CityManagement = () => {
  const { createCity, loading: loadingCreateCity, error: errorCreateCity } = useCreateCity()
  const { cities, loading: loadingCities, error: errorCities, refetch: readCities } = useReadCities()
  const { updateCity, loading: loadingUpdateCity, error: errorUpdateCity } = useUpdateCity()
  const { deleteCity, loading: loadingDeleteCity, error: errorDeleteCity } = useDeleteCity()
  const { searchTerm, handleChangeSearch, filteredData: filteredCities } = useSearchBar(cities, "name")
  
  // Create city
  const { 
    formData: cityCreateForm,
    handleChange: handleChangeCreate, 
    resetForm: resetCreateForm 
  } = useFormState({ name: "",  address: "" })


  const handleSubmitCreate = async (event) => {
    event.preventDefault()
    const result = await createCity(cityCreateForm.name, cityCreateForm.address)
    if (result) {
      resetCreateForm()
      await readCities()
    }
  }

  // Read cities
  const columns = [
    { key: "id", title: "ID" },
    { key: "name", title: "Name" },
    { key: "address", title: "Address"},
    { key: "created-updated", title: "Created / Updated"},
  ]
  const renderCell = (city, column) => {
    switch (column.key) {
      case "id": return city.id
      case "name": return city.name
      case "address": return city.address
      case "created-updated": return (`
        ${formatDate(city.created_at)}, 
        ${formatTime(city.created_at)} /
        ${formatDate(city.updated_at)}, 
        ${formatTime(city.updated_at)}
      `)
    }
  }
  const renderActions = (city) => (
    <>
    <SubmitButton
      onClick={() => handleStartUpdate(city)}
      loading={loadingUpdateCity}
      text={"Update"}
    />
    <SubmitButton 
      onClick={() => handleDelete(city.id)}
      loading={loadingDeleteCity}
      text={"Delete"}
    />
    </>
  )

  // Update city
  const [isUpdating, setIsUpdating] = useState(false)
  const [cityToUpdate, setCityToUpdate] = useState(null)
  const [cityId, setCityId] = useState("")
  const { 
    formData: updatedForm,
    setFormData: setUpdatedForm,
    handleChange: handleChangeUpdate,
    resetForm: resetUpdatedForm
  } = useFormState({ name: "",  address: "" })


  const handleStartUpdate = (city) => {
    setIsUpdating(true)
    setCityToUpdate(city)
    setCityId(city.id)
    setUpdatedForm({ name: city.name, address: city.address })
  }

  const handleSubmitUpdate = async (event) => {
    event.preventDefault()
    const result = await updateCity(cityId, updatedForm.name, updatedForm.address)
    if (result) {
      setIsUpdating(false)
      setCityToUpdate(null)
      setCityId("")
      resetUpdatedForm()
      await readCities()
    }
  }

  // Delete city
  const handleDelete = async (cityId) => {
    const result = await deleteCity(cityId)
    if (result) return await readCities()
  }

  return (
    <>
      <Center><Heading size="xl">City Management</Heading></Center>

      {/* Search Bar */}
      <SearchBar value={searchTerm} onChange={handleChangeSearch} text={"name"} />

      {/* City table & Update/Delete instance */}
      <ReusableTable
        loading={loadingCities}
        error={errorCities}
        additionalErrors={[errorUpdateCity, errorDeleteCity].filter(Boolean)}
        data={filteredCities}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        noDataMessage="No cities found!"
      />

      {/* Create city */}
      <FormWrapper
        title={"Add City"}
        onSubmit={handleSubmitCreate}
        submitText={"Add City"}
        loading={loadingCreateCity}
        error={errorCreateCity}
      >
        <Input 
          type="text"
          name="name"
          value={cityCreateForm.name}
          onChange={handleChangeCreate}
          bg="white"
          color="black"
          size="xs"
          placeholder="Type name..."
          required
        />
        <Input 
          type="text"
          name="address"
          value={cityCreateForm.address}
          onChange={handleChangeCreate}
          bg="white"
          color="black"
          size="xs"
          placeholder="Type address..."
          required
        />
      </FormWrapper>

      {/* Update city */}
      {isUpdating && (
        <FormWrapper
          title={"Update City"}
          onSubmit={handleSubmitUpdate}
          submitText={"Update City"}
          loading={loadingUpdateCity}
          error={errorUpdateCity}
        >
          <Field.Root>
            <Field.Label>Update name for City {cityToUpdate.name}:</Field.Label>
            <Input
              type="text"
              name="name"
              value={updatedForm.name}
              onChange={handleChangeUpdate}
              bg="white"
              color="black"
              size="xs"
              placeholder="Type name..."
              required 
            />
            <Input 
              type="text"
              name="address"
              value={updatedForm.address}
              onChange={handleChangeUpdate}
              bg="white"
              color="black"
              size="xs"
              placeholder="Type address..."
              required
            />
          </Field.Root>
        </FormWrapper>
      )}
    </>
  )
}
export default CityManagement