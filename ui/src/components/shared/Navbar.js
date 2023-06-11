import React, { useContext } from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { UserContext } from '../../context/userContext';

function CustomNavbar() {
  const { isAuthenticated, logout, user } = useContext(UserContext);

  const handleLogout = () => {
    console.log(user);
    // Perform any necessary logout actions
    logout();
  };

  return (
    <Navbar expand="lg" variant="dark" bg="dark" className="navbar">
      <Navbar.Brand as={Link} to="/" className="navbar-brand">
        Student Assess
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
        <Nav>
          <Nav.Link as={Link} to="/" className="nav-link">
            Home
          </Nav.Link>
          {isAuthenticated ? (
            <>
              {user?.role === 'student' && (
                <Nav.Link as={Link} to="/upload" className="nav-link">
                  Upload
                </Nav.Link>
              )}
              {user?.role === 'professor' && (
                <Nav.Link as={Link} to="/evaluation" className="nav-link">
                  Evaluation
                </Nav.Link>
              )}
              {user?.role === 'student' && (
                <Nav.Link as={Link} to="/peer-evaluation" className="nav-link">
                  Peer Evaluation
                </Nav.Link>
              )}
              {user?.role === 'professor' && (
                <Nav.Link as={Link} to="/professor-evaluation" className="nav-link">
                  Professor Evaluation
                </Nav.Link>
              )}
              {user?.role === 'professor' && (
                <Nav.Link as={Link} to="/register" className="nav-link">
                  Register
                </Nav.Link>
              )}
              <Nav.Link onClick={handleLogout} className="nav-link">
                Logout
              </Nav.Link>
            </>
          ) : (
            <Nav.Link as={Link} to="/login" className="nav-link">
              Login
            </Nav.Link>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default CustomNavbar;
