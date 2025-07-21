// React, dependencies & packages
import { useState } from 'react'

// UI
import { Center, Field, Heading, Input } from '@chakra-ui/react'

// App
import { useCreateGenre } from '@/hooks/movies/genre/staff/useCreateGenre'
import { useReadGenres } from '@/hooks/movies/genre/staff/useReadGenres'
import { useUpdateGenre } from '@/hooks/movies/genre/staff/useUpdateGenre'
import { useDeleteGenre } from '@/hooks/movies/genre/staff/useDeleteGenre'
import useSearchBar from '@/hooks/useSearchBar'
import SubmitButton from '@/components/common/SubmitButton'
import SearchBar from '@/components/common/SearchBar'
import ReusableTable from '@/components/common/ReusableTable'
import FormWrapper from '@/components/common/FormWrapper'
import { formatDate, formatTime } from '@/utils/DateTimeFormat'

// Write components here


const GenreManagement = () => {
  const { createGenre, loading: loadingCreateGenre, error: errorCreateGenre } = useCreateGenre()
  const { genres, loading: loadingGenres, error: errorGenres, refetch: readGenres } = useReadGenres()
  const { updateGenre, loading: loadingUpdateGenre, error: errorUpdateGenre } = useUpdateGenre()
  const { deleteGenre, loading: loadingDeleteGenre, error: errorDeletingGenre } = useDeleteGenre()
  const { searchTerm, handleChangeSearch, filteredData: filteredGenres } = useSearchBar(genres, "name")
  
  // Create genre
  const [genreNameCreate, setGenreNameCreate] = useState("")

  const handleSubmitCreate = async (event) => {
    event.preventDefault()
    const result = await createGenre(genreNameCreate)
    setGenreNameCreate("")
    if (result) return await readGenres()
  }

  // Read genres
  const columns = [
    { key: "id", title: "ID" },
    { key: "name", title: "Name" },
    { key: "created-updated", title: "Created / Updated"}
  ]
  const renderCell = (genre, column) => {
    switch (column.key) {
      case "id": return genre.id
      case "name": return genre.name
      case "created-updated": return (`
        ${formatDate(genre.created_at)}, 
        ${formatTime(genre.created_at)} /
        ${formatDate(genre.updated_at)}, 
        ${formatTime(genre.updated_at)}
      `)
    }
  }
  const renderActions = (genre) => (
    <>
    <SubmitButton
      onClick={() => handleStartUpdate(genre)}
      loading={loadingUpdateGenre}
      text={"Update"}
    />
    <SubmitButton 
      onClick={() => handleDelete(genre.id)}
      loading={loadingDeleteGenre}
      text={"Delete"}
    />
    </>
  )

  // Update genre
  const [isUpdating, setIsUpdating] = useState(false)
  const [genreToUpdate, setGenreToUpdate] = useState(null)
  const [genreId, setGenreId] = useState("")
  const [updatedName, setUpdatedName] = useState("")

  const handleStartUpdate = (genre) => {
    setIsUpdating(true)
    setGenreToUpdate(genre)
    setGenreId(genre.id)
    setUpdatedName(genre.name)
  }

  const handleSubmitUpdate = async (event) => {
    event.preventDefault()
    const result = await updateGenre(genreId, updatedName)
    setIsUpdating(false)
    if (result) return await readGenres()
  }

  // Delete genre
  const handleDelete = async (genreId) => {
    const result = await deleteGenre(genreId)
    if (result) return await readGenres()
  }

  return (
    <>
      <Center><Heading size="xl">Genre Management</Heading></Center>

      {/* Search Bar */}
      <SearchBar value={searchTerm} onChange={handleChangeSearch} text={"name"} />

      {/* Genre table & Update/Delete instance */}
      <ReusableTable
        loading={loadingGenres}
        error={errorGenres}
        additionalErrors={[errorUpdateGenre, errorDeletingGenre].filter(Boolean)}
        data={filteredGenres}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        noDataMessage="No genres found!"
      />

      {/* Create genre */}
      <FormWrapper
        title={"Add Genre"}
        onSubmit={handleSubmitCreate}
        submitText={"Add Genre"}
        loading={loadingCreateGenre}
        error={errorCreateGenre}
      >
        <Input 
          type="text"
          value={genreNameCreate}
          onChange={(event) => setGenreNameCreate(event.target.value)}
          bg="white"
          color="black"
          size="xs"
          placeholder="Type name..."
        />
      </FormWrapper>

      {/* Update genre */}
      {isUpdating && (
        <FormWrapper
          title={"Update Genre"}
          onSubmit={handleSubmitUpdate}
          submitText={"Update Genre"}
          loading={loadingUpdateGenre}
          error={errorUpdateGenre}
        >
          <Field.Root>
            <Field.Label>Update name for Genre {genreToUpdate.name}:</Field.Label>
            <Input
              type="text"
              value={updatedName}
              onChange={(event) => setUpdatedName(event.target.value)}
              bg="white"
              color="black"
              size="xs"
              placeholder="Type name..."
              required 
            />
          </Field.Root>
        </FormWrapper>
      )}
    </>
  )
}
export default GenreManagement