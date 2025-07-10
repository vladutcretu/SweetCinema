// React, dependencies & packages
import { Routes, Route } from 'react-router-dom'

// App
import Layout from './components/layout/Layout'

import MovieList from './pages/MovieList'
import ShowtimeList from './pages/ShowtimeList'
import MovieDetail from './pages/MovieDetail'
import ShowtimeDetail from './pages/ShowtimeDetail'
import PaymentCreate from './pages/PaymentCreate'
import UserProfile from './pages/UserProfile'
import StaffDashboard from './pages/StaffDashboard'

// Components here


function App() {
  return (
    <Layout children={
        <Routes>
          <Route path='/' element={<MovieList />} />
          <Route path='/showtimes/' element={<ShowtimeList />} />
          <Route path='/movie/:movieId/' element={<MovieDetail />} />
          <Route path='/showtime/:showtimeId/' element={<ShowtimeDetail />} />
          <Route path='/payment/' element={<PaymentCreate />} />
          <Route path='/profile/' element={<UserProfile />} />
          <Route path='/staff/' element={<StaffDashboard />} />
        </Routes>
    } />
  )
}

export default App