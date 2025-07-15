// React, dependencies & packages
import { useState } from 'react'

// UI
import { Center, Field, Heading, Input } from '@chakra-ui/react'

// App
import { useCreateMovie } from '@/hooks/movies/movie/staff/useCreateMovie'
import { useReadGenres } from '@/hooks/movies/genre/staff/useReadGenres'
import { useReadMovies } from '@/hooks/movies/movie/staff/useReadMovies'
import { useUpdateMovie } from '@/hooks/movies/movie/staff/useUpdateMovie'
import { useDeleteMovie } from '@/hooks/movies/movie/staff/useDeleteMovie'
import useSearchBar from '@/hooks/useSearchBar'
import SearchBar from '@/components/common/SearchBar'
import SubmitButton from '@/components/common/SubmitButton'
import ReusableTable from '@/components/common/ReusableTable'
import FormWrapper from '@/components/common/FormWrapper'
import useFormState from '@/hooks/useFormState'

// Write components here


const MovieManagement = () => {
  const { createMovie, loading: loadingCreateMovie, error: errorCreateMovie } = useCreateMovie()
  const { genres, loading: loadingGenres, error: errorGenres, refetch: getGenres } = useReadGenres()
  const { movies, loading: loadingMovies, error: errorMovies, refetch: readMovies } = useReadMovies()
  const { updateMovie, loading: loadingUpdateMovie, error: errorUpdateMovie } = useUpdateMovie()
  const { deleteMovie, loading: loadingDeleteMovie, error: errorDeleteMovie } = useDeleteMovie()
  const { searchTerm, handleChangeSearch, filteredData: filteredMovies } = useSearchBar(movies, "title")

  // Create movie
  const { 
    formData: movieCreateForm, 
    setFormData: setMovieCreateForm, 
    handleChange: handleChangeCreate, 
    resetForm: resetCreateForm 
  } = useFormState({ title: "",  description: "",  genres: [] })

  const handleGenreChange = (event) => {
    const selected = Array.from(event.target.selectedOptions, option => option.value)
    setMovieCreateForm(prev => ({ ...prev, genres: selected }))
  }

  const handleSubmitCreate = async (event) => {
    event.preventDefault()
    const result = await createMovie(movieCreateForm.title, movieCreateForm.description, movieCreateForm.genres)
    if (result) {
      resetCreateForm()
      await readMovies()
    }
  }

  // Read movies
  const columns = [
    { key: "id", title: "ID" },
    { key: "title", title: "Title" },
    { key: "description", title: "Description" },
    { key: "genres", title: "Genres" }
  ]
  const renderCell = (movie, column) => {
    switch (column.key) {
      case "id": return movie.id
      case "title": return movie.title
      case "description": return movie.description
      case "genres": return movie.genres.map(g => g.name).join(", ")
    }
  }
  const renderActions = (movie) => (
    <>
    <SubmitButton
      onClick={() => handleStartUpdate(movie)}
      loading={loadingUpdateMovie}
      text={"Update"}
    />
    <SubmitButton 
      onClick={() => handleDelete(movie.id)}
      loading={loadingDeleteMovie}
      text={"Delete"}
    />
    </>
  )

  // Update movie
  const [isUpdating, setIsUpdating] = useState(false)
  const [movieToUpdate, setMovieToUpdate] = useState(null)
  const [movieId, setMovieId] = useState("")
  const { 
    formData: updatedForm, 
    setFormData: setUpdatedForm, 
    handleChange: handleChangeUpdate, 
    resetForm: resetUpdatedForm 
  } = useFormState({ title: "", description: "", genres: [] })

  const handleStartUpdate = (movie) => {
    setIsUpdating(true)
    setMovieToUpdate(movie)
    setMovieId(movie.id)
    setUpdatedForm({ title: movie.title, description: movie.description, genres: movie.genres.map(g => g.name) })
  }

  const handleGenreChangeUpdate = (event) => {
    const selected = Array.from(event.target.selectedOptions, option => option.value)
    setUpdatedForm(prev => ({ ...prev, genres: selected }))
  }

  const handleSubmitUpdate = async (event) => {
    event.preventDefault()
    const result = await updateMovie(movieId, updatedForm.title, updatedForm.description, updatedForm.genres)
    if (result) {
      setIsUpdating(false)
      setMovieToUpdate(null)
      setMovieId("")
      resetUpdatedForm()
      await readMovies()
    }
  }
 
  // Delete movie
  const handleDelete = async (movieId) => {
    const result = await deleteMovie(movieId)
    if (result) return await readMovies()
  }

  return (
    <>
      <Center><Heading size="xl">Movie Management</Heading></Center>

      {/* Search Bar */}
      <SearchBar value={searchTerm} onChange={handleChangeSearch} text={"title"} />

      {/* Movie table & Update/Delete instance */}
      <ReusableTable
        loading={loadingMovies}
        error={errorMovies}
        additionalErrors={[errorUpdateMovie, errorDeleteMovie].filter(Boolean)}
        data={filteredMovies}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        noDataMessage="No movies found!"
      />

      {/* Create movie */}
      <FormWrapper
        title={"Add Movie"}
        onSubmit={handleSubmitCreate}
        submitText={"Add Movie"}
        loading={loadingCreateMovie}
        error={errorCreateMovie}
      >
          <Field.Label>Title:</Field.Label>
          <Input 
            type="text"
            name="title"
            value={movieCreateForm.title}
            onChange={handleChangeCreate}
            bg="white"
            color="black"
            size="xs"
            placeholder="Type title..."
            required
          />
          <Field.Label>Description:</Field.Label>
          <Input 
            type="areatext"
            name="description"
            value={movieCreateForm.description}
            onChange={handleChangeCreate}
            bg="white"
            color="black"
            size="xs"
            placeholder="Type description..."
            required
          />
          <Field.Label>Select Genre(s): </Field.Label>
            <select multiple value={movieCreateForm.genres} onChange={handleGenreChange} required>
              {genres.map(genre => (
                <option key={genre.id} value={genre.name}>{genre.name}</option>
              ))}
            </select>
      </FormWrapper>


      {/* Update movie */}
      {isUpdating && (
        <FormWrapper
          title={"Update Movie"}
          onSubmit={handleSubmitUpdate}
          submitText={"Update Movie"}
          loading={loadingUpdateMovie}
          error={errorUpdateMovie}
        >
          <Field.Label>New title for {movieToUpdate.title}</Field.Label>
          <Input 
            type="text"
            name="title"
            value={updatedForm.title}
            onChange={handleChangeUpdate}
            bg="white"
            color="black"
            size="xs"
            placeholder="Type title..."
            required
          />
          <Field.Label>Description:</Field.Label>
          <Input 
            type="text"
            name="description"
            value={updatedForm.description}
            onChange={handleChangeUpdate}
            bg="white"
            color="black"
            size="xs"
            placeholder="Type description..."
            required
          />
          <Field.Label>Select Genre(s): </Field.Label>
            <select multiple value={updatedForm.genres} onChange={handleGenreChangeUpdate} required>
              {genres.map(genre => (
                <option key={genre.id} value={genre.name}>{genre.name}</option>
              ))}
            </select>
      </FormWrapper>
      )}
    </>
  )
}
export default MovieManagement