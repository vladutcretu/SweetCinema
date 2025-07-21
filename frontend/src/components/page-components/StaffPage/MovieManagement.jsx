// React, dependencies & packages
import { useState } from 'react'

// UI
import { Center, Field, Flex, Heading, Input } from '@chakra-ui/react'

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
import { formatDate, formatTime } from '@/utils/DateTimeFormat'

// Write components here


const MovieManagement = () => {
  const { createMovie, loading: loadingCreateMovie, error: errorCreateMovie } = useCreateMovie()
  const { genres, loading: loadingGenres, error: errorGenres, refetch: getGenres } = useReadGenres()
  const { movies, loading: loadingMovies, error: errorMovies, refetch: readMovies } = useReadMovies()
  const { updateMovie, loading: loadingUpdateMovie, error: errorUpdateMovie } = useUpdateMovie()
  const { deleteMovie, loading: loadingDeleteMovie, error: errorDeleteMovie } = useDeleteMovie()
  const { searchTerm, handleChangeSearch, filteredData: filteredMovies } = useSearchBar(movies, "title")

  // Create / Update values and names to not fetch from db
  const parental_guides = [
    { value: "general", name: "G - General Audiences" },
    { value: "parental guidance", name: "PG - Parental Guidance Suggested" },
    { value: "parental strongly", name: "PG-13 - Parents Strongly Cautioned" },
    { value: "restricted", name: "R - Restricted" },
    { value: "adults", name: "NC-17 - Adults Only" }
  ]
    const languages = [
    { value: "english", name: "English" },
    { value: "french", name: "French" },
    { value: "spanish", name: "Spanish" },
    { value: "german", name: "German"},
    { value: "italian", name: "Italian"}
  ]

  // Create movie
  const { 
    formData: movieCreateForm, 
    setFormData: setMovieCreateForm, 
    handleChange: handleChangeCreate, 
    resetForm: resetCreateForm 
  } = useFormState({ 
    title: "",  
    description: "",  
    genres: [],
    poster: "",
    director: "",
    cast: "",
    release: "",
    durationHours: "",
    durationMinutes: "",
    parental_guide: "",
    language: ""
  })

  const handleGenreChange = (event) => {
    const selected = Array.from(event.target.selectedOptions, option => option.value)
    setMovieCreateForm(prev => ({ ...prev, genres: selected }))
  }
  const handlePGChange = (event) => {
    setMovieCreateForm(prev => ({ ...prev, parental_guide: event.target.value }))
  }
  const handleLangChange = (event) => {
    setMovieCreateForm(prev => ({ ...prev, language: event.target.value }))
  }

  const handleSubmitCreate = async (event) => {
    event.preventDefault()
    const duration = `${String(movieCreateForm.durationHours).padStart(2, "0")}:${String(movieCreateForm.durationMinutes).padStart(2, "0")}:00`
    const result = await createMovie(
      movieCreateForm.title, 
      movieCreateForm.description, 
      movieCreateForm.genres,
      movieCreateForm.poster,
      movieCreateForm.director,
      movieCreateForm.cast,
      movieCreateForm.release,
      duration,
      movieCreateForm.parental_guide,
      movieCreateForm.language
    )
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
    { key: "genres", title: "Genres" },
    { key: "info", title: "Informations" },
    { key: "created-updated", title: "Created / Updated"},

  ]
  const renderCell = (movie, column) => {
    switch (column.key) {
      case "id": return movie.id
      case "title": return movie.title
      case "description": return movie.description
      case "genres": return movie.genres.map(g => g.name).join(", ")
      case "info": return (
        <>
          <b>Poster:</b> <a href={movie.poster}>click</a><br />
          <b>Director:</b> {movie.director}<br />
          <b>Cast:</b> {movie.cast}<br />
          <b>Release date:</b> {movie.release}<br />
          <b>Duration:</b> {movie.duration}<br />
          <b>PG:</b> {movie.parental_guide}<br />
          <b>Language:</b> {movie.language}<br />
        </>
      )
      case "created-updated": return (`
        ${formatDate(movie.created_at)}, 
        ${formatTime(movie.created_at)} /
        ${formatDate(movie.updated_at)}, 
        ${formatTime(movie.updated_at)}
      `)
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
  } = useFormState({ 
    title: "", 
    description: "", 
    genres: [],
    poster: "",
    director: "",
    cast: "",
    release: "",
    durationHours: "",
    durationMinutes: "",
    parental_guide: "",
    language: "" 
  })

  const handleStartUpdate = (movie) => {
    setIsUpdating(true)
    setMovieToUpdate(movie)
    setMovieId(movie.id)
    setUpdatedForm({ 
      title: movie.title, 
      description: movie.description, 
      genres: movie.genres.map(g => g.name),
      poster: movie.poster,
      director: movie.director,
      cast: movie.cast,
      release: movie.release,
      parental_guide: movie.parental_guide.value,
      language: movie.language.value
    })
  }

  const handleGenreChangeUpdate = (event) => {
    const selected = Array.from(event.target.selectedOptions, option => option.value)
    setUpdatedForm(prev => ({ ...prev, genres: selected }))
  }
  const handlePGChangeUpdate = (event) => {
    setUpdatedForm(prev => ({ ...prev, parental_guide: event.target.value }))
  }
  const handleLangChangeUpdate = (event) => {
    setUpdatedForm(prev => ({ ...prev, language: event.target.value }))
  }

  const handleSubmitUpdate = async (event) => {
    event.preventDefault()
    const updatedDuration = `${String(updatedForm.durationHours || 0).padStart(2, "0")}:${String(updatedForm.durationMinutes || 0).padStart(2, "0")}:00`
    const result = await updateMovie(
      movieId, 
      updatedForm.title, 
      updatedForm.description, 
      updatedForm.genres,
      updatedForm.poster,
      updatedForm.director,
      updatedForm.cast,
      updatedForm.release,
      updatedDuration,
      updatedForm.parental_guide,
      updatedForm.language
    )
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
            bg="black"
            color="white"
            placeholder="Type title..."
            required
          />
          <Field.Label>Description:</Field.Label>
          <Input 
            type="text"
            name="description"
            value={movieCreateForm.description}
            onChange={handleChangeCreate}
            bg="black"
            color="white"
            placeholder="Type description..."
            required
          />
          <Field.Label>Select Genre(s): </Field.Label>
            <select multiple value={movieCreateForm.genres} onChange={handleGenreChange} required>
              {genres.map(genre => (
                <option key={genre.id} value={genre.id}>{genre.name}</option>
              ))}
            </select>
          <Field.Label>Poster:</Field.Label>
          <Input 
            type="url"
            name="poster"
            value={movieCreateForm.poster}
            onChange={handleChangeCreate}
            bg="black"
            color="white"
            placeholder="Paste url..."
            required
          />
          <Field.Label>Director</Field.Label>
          <Input 
            type="text"
            name="director"
            value={movieCreateForm.director}
            onChange={handleChangeCreate}
            bg="black"
            color="white"
            placeholder="Type director name..."
            required
          />
          <Field.Label>Cast</Field.Label>
          <Input 
            type="text"
            name="cast"
            value={movieCreateForm.cast}
            onChange={handleChangeCreate}
            bg="black"
            color="white"
            placeholder="Type actors name separated by comma..."
            required
          />
          <Field.Label>Release Date:</Field.Label>
          <Input 
            type="date"
            name="release"
            value={movieCreateForm.release}
            onChange={handleChangeCreate}
            bg="black"
            color="white"
            required
          />
          <Field.Label>Duration:</Field.Label>
          <Flex gap={2}>
              <Input
                type="number"
                min={0}
                max={23}
                placeholder="H"
                name="durationHours"
                value={movieCreateForm.durationHours}
                onChange={handleChangeCreate}
                bg="black"
                color="white"
              />
              <Input
                type="number"
                min={0}
                max={59}
                placeholder="M"
                name="durationMinutes"
                value={movieCreateForm.durationMinutes}
                onChange={handleChangeCreate}
                bg="black"
                color="white"
              />
          </Flex>
          <Field.Label>Parental Guide:</Field.Label>
          <select value={movieCreateForm.parental_guide} onChange={handlePGChange} required>
            {parental_guides.map(pg => (
              <option key={pg.value} value={pg.value}>{pg.name}</option>
            ))}
          </select>
          <Field.Label>Language</Field.Label>
          <select value={movieCreateForm.language} onChange={handleLangChange} required>
            {languages.map(lang => (
              <option key={lang.value} value={lang.value}>{lang.name}</option>
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
            bg="black"
            color="white"
            placeholder="Type title..."
            required
          />
          <Field.Label>Description:</Field.Label>
          <Input 
            type="text"
            name="description"
            value={updatedForm.description}
            onChange={handleChangeUpdate}
            bg="black"
            color="white"
            size="xs"
            placeholder="Type description..."
            required
          />
          <Field.Label>Select Genre(s): </Field.Label>
            <select multiple value={updatedForm.genres} onChange={handleGenreChangeUpdate} required>
              {genres.map(genre => (
                <option key={genre.id} value={genre.id}>{genre.name}</option>
              ))}
            </select>
          <Field.Label>Poster:</Field.Label>
          <Input 
            type="url"
            name="poster"
            value={updatedForm.poster}
            onChange={handleChangeUpdate}
            bg="black"
            color="white"
            placeholder="Paste url..."
            required
          />
          <Field.Label>Director</Field.Label>
          <Input 
            type="text"
            name="director"
            value={updatedForm.director}
            onChange={handleChangeUpdate}
            bg="black"
            color="white"
            placeholder="Type director name..."
            required
          />
          <Field.Label>Cast</Field.Label>
          <Input 
            type="text"
            name="cast"
            value={updatedForm.cast}
            onChange={handleChangeUpdate}
            bg="black"
            color="white"
            placeholder="Type actors name separated by comma..."
            required
          />
          <Field.Label>Release Date:</Field.Label>
          <Input 
            type="date"
            name="release"
            value={updatedForm.release}
            onChange={handleChangeUpdate}
            bg="black"
            color="white"
            required
          />
          <Field.Label>Duration:</Field.Label>
          <Flex gap={2}>
            <Input
              type="number"
              min={0}
              max={23}
              placeholder="H"
              name="durationHours"
              value={updatedForm.durationHours}
              onChange={handleChangeUpdate}
              bg="black"
              color="white"
            />
            <Input
              type="number"
              min={0}
              max={59}
              placeholder="M"
              name="durationMinutes"
              value={updatedForm.durationMinutes}
              onChange={handleChangeUpdate}
              bg="black"
              color="white"
            />
          </Flex>
          <Field.Label>Parental Guide:</Field.Label>
          <select value={updatedForm.parental_guide} onChange={handlePGChangeUpdate} required>
            {parental_guides.map(pg => (
              <option key={pg.value} value={pg.value}>{pg.name}</option>
            ))}
          </select>
          <Field.Label>Language</Field.Label>
          <select value={updatedForm.language} onChange={handleLangChangeUpdate} required>
            {languages.map(lang => (
              <option key={lang.value} value={lang.value}>{lang.name}</option>
            ))}
          </select>
      </FormWrapper>
      )}
    </>
  )
}
export default MovieManagement