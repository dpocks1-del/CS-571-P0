import { NavLink, Link } from 'react-router-dom'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'

export default function NavBar() {
  return (
    <Navbar expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Resale Hub
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="mainNav" />

        <Navbar.Collapse id="mainNav">
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="/purchase" end>
              Purchase
            </Nav.Link>
            <Nav.Link as={NavLink} to="/communications">
              Communications
            </Nav.Link>
            <Nav.Link as={NavLink} to="/list">
              List
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}