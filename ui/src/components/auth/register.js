import React, { useState } from 'react';
import { Form, Button, Container, Alert, Spinner } from 'react-bootstrap';

const Register = () => {
  const [csvFile, setCsvFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setCsvFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    if (!csvFile) {
      setError('Please select a CSV file');
      return;
    }

    // Create a FormData object
    const formData = new FormData();
    formData.append('csvFile', csvFile);

    // Show the loader
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3500/api/auth/send-credentials', {
        method: 'POST',
        body: formData
      });

      const data = await response.json(); // Parse the response body as JSON

      if (response.ok) {
        console.log('CSV file sent successfully');
        setSuccess(true);
        setError('');
      } else {
        console.log('Error sending CSV file:', data.error);
        setError('Error sending CSV file. Please try again later.');
        setSuccess(false);
      }
    } catch (error) {
      console.log('Error sending CSV file:', error);
      setError('Error sending CSV file. Please try again later.');
      setSuccess(false);
    }

    setLoading(false);
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Register</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">CSV file sent to the server</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formFile">
          <Form.Label className="mb-3">Select a CSV file</Form.Label>
          <Form.Control type="file" accept=".csv" name="csvFile" onChange={handleFileChange} className="mb-3" isInvalid={!!error} />
          <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100" disabled={loading}>
          {loading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Sending CSV
            </>
          ) : (
            'Send CSV'
          )}
        </Button>
      </Form>
    </Container>
  );
};

export default Register;
