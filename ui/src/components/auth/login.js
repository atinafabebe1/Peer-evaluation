import React, { useState, useContext } from 'react';
import { Form, Button, Container, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/userContext';
import jwt from 'jwt-decode';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3500/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      console.log(response);
      if (response.ok) {
        const data = await response.json();
        console.log(data);

        // Decode the JWT token
        const decodedToken = jwt(data.token);
        console.log(decodedToken);

        // Save the decoded user information to the context
        login(decodedToken, data);

        navigate('/');
      } else {
        setError('Invalid username or password');
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
    }

    setIsLoading(false);
  };

  return (
    <Container className="mt-5 w-50">
      <h2 className="text-center mb-4">Login</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" placeholder="Enter username" value={username} onChange={handleUsernameChange} className="mb-3" />
        </Form.Group>

        <Form.Group controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" value={password} onChange={handlePasswordChange} className="mb-3" />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100" disabled={isLoading}>
          {isLoading ? (
            <>
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
              <span className="ml-2">Logging in...</span>
            </>
          ) : (
            'Login'
          )}
        </Button>
      </Form>
    </Container>
  );
};

export default Login;
