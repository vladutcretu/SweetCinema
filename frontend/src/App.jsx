// React, dependencies & packages
import { Routes, Route } from 'react-router-dom'

// App
import Layout from './components/layout/Layout'

import Home from './pages/Home'
import Movie from './pages/Movie'
import Showtime from './pages/Showtime'

import ShowtimeList from './pages/ShowtimeList'
import PaymentCreate from './pages/PaymentCreate'
import UserProfile from './pages/UserProfile'
import StaffDashboard from './pages/StaffDashboard'


// Components here


function App() {
  return (
    <Layout children={
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/movie/:movieId/' element={<Movie />} />
          <Route path='/showtime/:showtimeId/' element={<Showtime />} />

          <Route path='/showtimes/' element={<ShowtimeList />} />
          <Route path='/payment/' element={<PaymentCreate />} />
          <Route path='/profile/' element={<UserProfile />} />
          <Route path='/staff/' element={<StaffDashboard />} />
        </Routes>
    } />
  )
}

export default App