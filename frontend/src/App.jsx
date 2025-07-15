// React, dependencies & packages
import { Routes, Route } from 'react-router-dom'

// App
import Layout from './components/layout/Layout'

import Home from './pages/Home'
import Movie from './pages/Movie'
import Showtime from './pages/Showtime'
import Payment from './pages/Payment'

import Profile from './pages/Profile'
import Staff from './pages/Staff'

import Showtimes from './pages/Showtimes'

// Components here


function App() {
  return (
    <Layout children={
        <Routes>
          {/* User: main workflow */}
          <Route path='/' element={<Home />} />
          <Route path='/movie/:movieId/' element={<Movie />} />
          <Route path='/showtime/:showtimeId/' element={<Showtime />} />
          <Route path='/payment/' element={<Payment />} />

          {/* User & Staff: setup workflow */}
          <Route path='/profile/' element={<Profile />} />
          <Route path='/staff/' element={<Staff/>} />

          {/* User: secondary pages */}
          <Route path='/showtimes/' element={<Showtimes />} />
        </Routes>
    } />
  )
}

export default App