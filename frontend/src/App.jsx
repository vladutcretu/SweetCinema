import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Header from './components/base/Header'
import Footer from './components/base/Footer'

import MovieList from './pages/MovieList'
import MovieDetail from './pages/MovieDetail'

function App() {
  return (
    <>
    <Router>
      <div className='page-layout'>
        <Header />
        <main className='main'>
          <Routes>
            <Route path='/' element={<MovieList />} />
            <Route path='/movie/:movieId' element={<MovieDetail />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
    </>
  )
}

export default App
