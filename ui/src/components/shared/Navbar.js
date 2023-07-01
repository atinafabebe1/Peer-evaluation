import React, { useContext, useState } from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { UserContext } from '../../context/userContext';

function CustomNavbar() {
  const { isAuthenticated, logout, user } = useContext(UserContext);
  const [navbarStyle, setNavbarStyle] = useState({ background: '#002244', color: '#ffffff' });

  const handleLogout = () => {
    console.log(user);
    logout();
  };

  const renderNavLinks = () => {
    if (isAuthenticated) {
      if (user?.role === 'student') {
        return (
          <>
            <Nav.Link as={Link} to="/upload" className="nav-link">
              Upload
            </Nav.Link>
            <Nav.Link as={Link} to="/peer-evaluation" className="nav-link">
              Peer Evaluation
            </Nav.Link>
          </>
        );
      } else if (user?.role === 'professor') {
        return (
          <>
            <Nav.Link as={Link} to="/evaluation" className="nav-link">
              Evaluation
            </Nav.Link>
            <Nav.Link as={Link} to="/professor-evaluation" className="nav-link">
              Professor Evaluation
            </Nav.Link>
            <Nav.Link as={Link} to="/report" className="nav-link">
              Report
            </Nav.Link>
            <Nav.Link as={Link} to="/register" className="nav-link">
              Register
            </Nav.Link>
          </>
        );
      }
    } else {
      return (
        <Nav.Link as={Link} to="/login" className="nav-link">
          Login
        </Nav.Link>
      );
    }
  };

  return (
    <Navbar expand="lg" variant="dark" className="navbar-custom p-2" style={{ ...navbarStyle, position: 'sticky', top: 0, zIndex: 100 }}>
      <Navbar.Brand as={Link} to="/" className="navbar-brand p-">
        Student Assess
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
        <Nav className="ml-auto mr-3">
          <Nav.Link as={Link} to="/" className="nav-link">
            Home
          </Nav.Link>
          {renderNavLinks()}
          {isAuthenticated && (
            <Nav.Link onClick={handleLogout} className="nav-link">
              Logout
            </Nav.Link>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default CustomNavbar;
