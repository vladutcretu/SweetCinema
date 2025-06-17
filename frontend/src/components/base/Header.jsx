import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'

function HeaderNav() {
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
                <NavDropdown title="Location" id="collapsible-nav-dropdown">
                    <NavDropdown.Item href="/">City #1</NavDropdown.Item>
                    <NavDropdown.Item href="/">City #2</NavDropdown.Item>
                    <NavDropdown.Item href="/">City #3</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="/">Ask for new location</NavDropdown.Item>
                </NavDropdown>
                <Nav.Link href="/">Log In</Nav.Link>
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
