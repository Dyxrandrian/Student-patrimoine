import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';

const Header = () => {
  return (
    <Navbar className='navbar' expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/patrimoine" className='btn btn-primary'>Mon Patrimoine</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/patrimoine" className='link-light'>Patrimoine</Nav.Link>
            <Nav.Link as={Link} to="/possession" className='link-light'>Liste des Possessions</Nav.Link>
            <Nav.Link as={Link} to="/possession/create" className='link-light'>Créer une Possession</Nav.Link>
            <Nav.Link as={Link} to="/patrimoine/range" className='link-light'>Plage de Patrimoine</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
