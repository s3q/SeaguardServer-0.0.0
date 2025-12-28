import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import "../css/home.css";

export default function SeaguardNavbar() {
  return (
    <Navbar expand="lg" className="px-3 navbar" data-bs-theme="dark">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center nav-title">
          Seaguard 0.0.0
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="/" className="mx-2 nav-link">
              Dashboard
            </Nav.Link>
            <Nav.Link as={NavLink} to="/boats" className="mx-2 nav-link">
              Boats
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
