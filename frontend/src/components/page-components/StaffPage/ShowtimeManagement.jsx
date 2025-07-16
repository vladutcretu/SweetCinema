// React, dependencies & packages
import { useState } from 'react'

// UI
import { Center, Field, Heading, Input } from '@chakra-ui/react'

// App
import { useCreateShowtime } from '@/hooks/showtimes/staff/useCreateShowtime'
import { useReadMovies } from '@/hooks/movies/movie/staff/useReadMovies'
import { useReadShowtimes } from '@/hooks/showtimes/staff/useReadShowtimes'
import { useUpdateShowtime } from '@/hooks/showtimes/staff/useUpdateShowtime'
import { useDeleteShowtime } from '@/hooks/showtimes/staff/useDeleteShowtime'
import useFormState from '@/hooks/useFormState'
import { useReadTheaters } from '@/hooks/locations/theater/staff/useReadTheaters'
import useSearchBar from '@/hooks/useSearchBar'
import SearchBar from '@/components/common/SearchBar'
import { formatDate, formatTime } from '@/utils/DateTimeFormat'
import SubmitButton from '@/components/common/SubmitButton'
import ReusableTable from '@/components/common/ReusableTable'
import FormWrapper from '@/components/common/FormWrapper'

// Write components here


const ShowtimeManagement = () => {
  const { createShowtime, loading: loadingCreateShowtime, error: errorCreateShowtime } = useCreateShowtime()
  const { movies, loading: loadingMovies, error: errorMovies, refetch: getMovies } = useReadMovies()
  const { theaters, loading: loadingTheaters, error: errorTheaters, refetch: readTheaters } = useReadTheaters()
  const { showtimes, loading: loadingShowtimes, error: errorShowtimes, refetch: readShowtimes } = useReadShowtimes()
  const { updateShowtime, loading: loadingUpdateShowtime, error: errorUpdateShowtime } = useUpdateShowtime()
  const { deleteShowtime, loading: loadingDeleteShowtime, error: errorDeleteShowtime } = useDeleteShowtime()
  const { searchTerm, handleChangeSearch, filteredData: filteredShowtimes } = useSearchBar(showtimes, (showtime) => showtime.movie.title)

  // Create showtime
  const { 
    formData: showtimeCreateForm, 
    setFormData: setShowtimeCreateForm, 
    handleChange: handleChangeCreate, 
    resetForm: resetCreateForm 
  } = useFormState({ movie: "", theater: "", price: "", starts_at: "" })

  const handleMovieChangeCreate = (event) => {
    const selected = event.target.value
    setShowtimeCreateForm(prev => ({ ...prev, movie: selected }))
  }

  const handleTheaterChangeCreate = (event) => {
    const selected = event.target.value
    setShowtimeCreateForm(prev => ({ ...prev, theater: selected }))
  }

  const handleSubmitCreate = async (event) => {
    event.preventDefault()
    const result = await createShowtime(
      showtimeCreateForm.movie, 
      showtimeCreateForm.theater, 
      showtimeCreateForm.price,
      showtimeCreateForm.starts_at
    )
    if (result) {
      resetCreateForm()
      await readShowtimes()
    }
  }

  // Read showtimes
  const columns = [
    { key: "id", title: "ID" },
    { key: "movie", title: "Movie Title" },
    { key: "location", title: "Location" },
    { key: "price", title: "Price" },
    { key: "date-time", title: "Date/Time" }
  ]
  const renderCell = (showtime, column) => {
    switch (column.key) {
      case "id": return showtime.id
      case "movie": return showtime.movie.title
      case "location": return `${showtime.theater.city.name}, ${showtime.theater.name}`
      case "price": return showtime.price
      case "date-time": return `${formatDate(showtime.starts_at)}, ${formatTime(showtime.starts_at)}`
    }
  }
  const renderActions = (showtime) => (
    <>
    <SubmitButton
      onClick={() => handleStartUpdate(showtime)}
      loading={loadingUpdateShowtime}
      text={"Update"}
    />
    <SubmitButton 
      onClick={() => handleDelete(showtime.id)}
      loading={loadingDeleteShowtime}
      text={"Delete"}
    />
    </>
  )

  // Update showtime
  const [isUpdating, setIsUpdating] = useState(false)
  const [showtimeToUpdate, setShowtimeToUpdate] = useState(null)
  const [showtimeId, setShowtimeId] = useState("")
  const { 
    formData: updatedForm, 
    setFormData: setShowtimeUpdatedForm, 
    handleChange: handleChangeUpdate, 
    resetForm: resetUpdatedForm 
  } = useFormState({ price: "", starts_at: "" })

  const handleStartUpdate = (showtime) => {
    setIsUpdating(true)
    setShowtimeToUpdate(showtime)
    setShowtimeId(showtime.id)
    setShowtimeUpdatedForm({
      price: showtime.price, 
      starts_at: showtime.starts_at.slice(0, 16) 
    })
  }

  const handleSubmitUpdate = async (event) => {
    event.preventDefault()
    const result = await updateShowtime(
      showtimeId,
      updatedForm.price, 
      updatedForm.starts_at
    )
    if (result) {
      setIsUpdating(false)
      setShowtimeToUpdate(null)
      setShowtimeId("")
      resetUpdatedForm()
      await readShowtimes()
    }
  }
 
  // Delete showtime
  const handleDelete = async (showtimeId) => {
    const result = await deleteShowtime(showtimeId)
    if (result) return await readShowtimes()
  }

  return (
    <>
      <Center><Heading size="xl">Showtime Management</Heading></Center>

      {/* Search Bar */}
      <SearchBar value={searchTerm} onChange={handleChangeSearch} text={"movie"} />

      {/* Showtime table & Update/Delete instance */}
      <ReusableTable
        loading={loadingShowtimes}
        error={errorShowtimes}
        additionalErrors={[errorUpdateShowtime, errorDeleteShowtime].filter(Boolean)}
        data={filteredShowtimes}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        noDataMessage="No showtimes found!"
      />

      {/* Create showtime */}
      <FormWrapper
        title={"Add Showtime"}
        onSubmit={handleSubmitCreate}
        submitText={"Add Showtime"}
        loading={loadingCreateShowtime}
        error={errorCreateShowtime}
      >
          <Field.Label>Movie:</Field.Label>
            <select type="text" name="movie" value={showtimeCreateForm.movie} onChange={handleMovieChangeCreate} required>
              <option value="" disabled>Select movie</option>
              {movies.map((movie) => (<option key={movie.id} value={movie.id}>{movie.title}</option>))}
            </select>
          <Field.Label>Showtime:</Field.Label>
            <select type="text" name="theater" value={showtimeCreateForm.theater} onChange={handleTheaterChangeCreate} required>
              <option value="" disabled>Select theater</option>
              {theaters.map((theater) => (<option key={theater.id} value={theater.id}>{theater.city.name}, {theater.name}</option>))}
            </select>
          <Field.Label>Price:</Field.Label>
            <Input 
              type="number"
              name="price"
              value={showtimeCreateForm.price}
              onChange={handleChangeCreate}
              bg="white"
              color="black"
              size="xs"
              required
            />
          <Field.Label>Starts date/time:</Field.Label>
            <input type="datetime-local" name="starts_at" value={showtimeCreateForm.starts_at} onChange={handleChangeCreate} required />
      </FormWrapper>


      {/* Update showtime */}
      {isUpdating && (
        <FormWrapper
          title={"Update Showtime"}
          onSubmit={handleSubmitUpdate}
          submitText={"Update Showtime"}
          loading={loadingUpdateShowtime}
          error={errorUpdateShowtime}
        >
          <Field.Label>Price:</Field.Label>
            <Input 
              type="number"
              name="price"
              value={updatedForm.price}
              onChange={handleChangeUpdate}
              bg="white"
              color="black"
              size="xs"
              required
            />
          <Field.Label>Starts date/time:</Field.Label>
            <input type="datetime-local" name="starts_at" value={updatedForm.starts_at} onChange={handleChangeUpdate} required />
      </FormWrapper>
      )}
    </>
  )
}
export default ShowtimeManagement