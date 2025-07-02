// React, dependencies & packages
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// App
import Header from './components/base/Header'
import Footer from './components/base/Footer'

import MovieList from './pages/MovieList'
import ShowtimeList from './pages/ShowtimeList'
import MovieDetail from './pages/MovieDetail'
import ShowtimeDetail from './pages/ShowtimeDetail'
import PaymentCreate from './pages/PaymentCreate'
import UserProfile from './pages/UserProfile'
import StaffDashboard from './pages/StaffDashboard'

function App() {
  return (
    <>
    <Router>
      <div className='page-layout'>
        <Header />
        <main className='main'>
          <Routes>
            <Route path='/' element={<MovieList />} />
            <Route path='/showtimes/' element={<ShowtimeList />} />
            <Route path='/movie/:movieId/' element={<MovieDetail />} />
            <Route path='/showtime/:showtimeId/' element={<ShowtimeDetail />} />
            <Route path='/payment/' element={<PaymentCreate />} />
            <Route path='/profile/' element={<UserProfile />} />
            <Route path='/staff/' element={<StaffDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
    </>
  )
}

export default App
