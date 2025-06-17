import Header from './components/base/Header'
import Footer from './components/base/Footer'

function App() {
  return (
    <>
    <div className='page-layout'>
      <Header />
      <main className='main'>
        <p>Page content</p>
      </main>
      <Footer />
    </div>
    </>
  )
}

export default App
