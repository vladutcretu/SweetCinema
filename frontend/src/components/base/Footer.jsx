import Nav from 'react-bootstrap/Nav'

function FooterNav() {
    return (
        <Nav className="justify-content-center" as="ul">
            <Nav.Item as="li">
                <Nav.Link href="/">About Us</Nav.Link>
            </Nav.Item>
            <Nav.Item as="li">
                <Nav.Link href="/">Contact</Nav.Link>
            </Nav.Item>
            <Nav.Item as="li">
                <Nav.Link href="/">Rules</Nav.Link>
            </Nav.Item>
            <Nav.Item as="li">
                <Nav.Link href="/">Help & FAQ</Nav.Link>
            </Nav.Item>
            <Nav.Item as="li">
                <Nav.Link href="/">Privacy</Nav.Link>
            </Nav.Item>
            <Nav.Item as="li">
                <Nav.Link href="/">Cookies</Nav.Link>
            </Nav.Item>
        </Nav>
    )
}

function Footer() {
    return (
        <>
        <footer className="footer">
            <FooterNav />
            <p>Links to Socials</p>
            <p>This site uses cookies to personalize content, for traffic analysis and statistics; some site usage information is processed by our partners. You can delete cookies from your browser at any time.</p>
            <p>&copy; {new Date().getFullYear()} Sweet Cinema project developed by <a href="https://github.com/vladutcretu" target="blank_">Vladut Cretu</a></p>
        </footer>
        </>
    )
}

export default Footer
