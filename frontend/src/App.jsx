import Header from './components/base/Header'
import Footer from './components/base/Footer'

import { useCityContext } from './contexts/CityContext'

function App() {
  // Test save City data selected by user and show City data to main content
  const {selectedCityId, setSelectedCityId, selectedCityName, setSelectedCityName} = useCityContext()

  return (
    <>
    <div className='page-layout'>
      <Header />
      <main className='main'>
        <p>User selected the following City location: ID {selectedCityId}, name: {selectedCityName}</p>
      </main>
      <Footer />
    </div>
    </>
  )
}

export default App
