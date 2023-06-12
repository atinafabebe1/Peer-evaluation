import React, { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import api from '../../api/api';
const PresentationUpload = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [presentationFile, setFile] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !presentationFile) {
      setError('Please fill in all the fields');
      return;
    }

    setError('');
    setIsLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('presentationFile', presentationFile);

    try {
      const response = await api.post('/api/presentations', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log(response.data); // Handle the response data as needed
      // Reset the form
      setTitle('');
      setDescription('');
      setFile(null);
    } catch (error) {
      setError('An error occurred. Please try again later.');
    }

    setIsLoading(false);
  };

  return (
    <div className="container p-4 w-75">
      <h2>Upload Presentation</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit} className="needs-validation" noValidate>
        <Form.Group controlId="formTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control type="text" value={title} onChange={handleTitleChange} required className="form-control" />
          <div className="invalid-feedback">Please enter a title.</div>
        </Form.Group>
        <Form.Group controlId="formDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control as="textarea" rows={3} value={description} onChange={handleDescriptionChange} required className="form-control" />
          <div className="invalid-feedback">Please enter a description.</div>
        </Form.Group>
        <Form.Group controlId="formFile">
          <Form.Label>Select File</Form.Label>
          <Form.Control type="file" name="presentationFile" onChange={handleFileChange} className="mb-3" isInvalid={!!error} />
          <div className="invalid-feedback">Please select a file.</div>
        </Form.Group>
        <Button type="submit" disabled={isLoading} variant="primary" className="upload-button">
          {isLoading ? (
            <>
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
              <span className="ml-2">Uploading...</span>
            </>
          ) : (
            'Upload'
          )}
        </Button>
      </Form>
    </div>
  );
};

export default PresentationUpload;
