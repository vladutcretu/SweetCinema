import { useState, useEffect } from 'react'
import { useCityContext } from '../../contexts/CityContext'

import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import GoogleAuth from '../auth/GoogleAuth'

function HeaderNav() {
    // Fetch City data for Locations dropdown
    const [cities, setCities] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const getCityList = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/locations/cities/`)
                if (!response.ok) {
                    throw new Error(`HTTP error! Response status: ${response.status}`)
                } else {
                    const data = await response.json()
                    setCities(data)
                }
            } catch (error) {
                console.error('Fetching City error', error)
                setError('Locations cannot be loaded. Please try again!')
            } finally {
                setLoading(false)
            }
        }

        getCityList()
    }, [])

    // Save City data selected by user
    const {selectedCityId, setSelectedCityId, selectedCityName, setSelectedCityName} = useCityContext()

    return (
        <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
            <Container>
            <Navbar.Brand href="/">Shows</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto">
                <Nav.Link href="/">Pricing</Nav.Link>
                <Nav.Link href="/">SweetCard</Nav.Link>
                <Nav.Link href="/">Newsletter</Nav.Link>
                </Nav>
                <Nav>
                    {loading && <p>City locations are loading</p>}
                    {error && <p>{error}</p>}
                    <NavDropdown title={selectedCityName} id="collapsible-nav-dropdown">
                        {cities.map(city => (
                            <NavDropdown.Item key={city.id} onClick={() => {
                                setSelectedCityId(city.id)
                                setSelectedCityName(city.name)
                            }}>{city.name}</NavDropdown.Item>
                        ))}
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="/">Ask for new location</NavDropdown.Item>
                    </NavDropdown>
                <Nav.Link><GoogleAuth /></Nav.Link>
                </Nav>
            </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

function Header() {
    return (
        <>
        <header className="header">
            <div className="header-banner">
                <a href="/"><img src="banner.png" alt="Sweet Cinema"></img></a>
            </div>
            <HeaderNav />
        </header>
        </>
    )
}

export default Header
