import React, { useState, useEffect, useContext } from 'react';
import { Container, Table, Alert, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import api from '../../api/api.js';
import { UserContext } from '../../context/userContext.js';

export default function PeerEvaluation() {
  const [presentations, setPresentations] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  useEffect(() => {
    fetchPresentations();
  }, []);

  const fetchPresentations = async () => {
    try {
      const response = await api.get('/api/presentations?status=onprogress');
      const data = response.data?.data;

      // Check if the user has already evaluated each presentation
      for (const presentation of data) {
        const evaluationResponse = await api.get(`/api/evaluations?presentation=${presentation._id}&evaluator=${user.id}`);
        const evaluationData = evaluationResponse.data;

        presentation.hasEvaluated = evaluationData.count > 0;
      }

      setPresentations(data);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch presentations:', error);
      setError('Failed to fetch presentations. Please try again later.');
    }
  };

  useEffect(() => {
    console.log('Updated presentations:', presentations);
  }, [presentations]);

  const handleEvaluate = async (presentationId) => {
    const presentation = presentations.find((presentation) => presentation._id === presentationId);

    if (!presentation.hasEvaluated && presentation.status !== 'waiting') {
      navigate(`/evaluate/${presentationId}`);
    }
  };

  const handleDownload = async (presentationId) => {
    try {
      const response = await api.get(`/api/presentations/${presentationId}/download`, {
        responseType: 'blob' // Set the response type to blob
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'presentation.pptx'); // Set the desired filename for the download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to download presentation:', error);
    }
  };

  return (
    <Container className="mt-5">
      <h1 className="display-4 text-center mb-4">Student Evaluation</h1>
      <hr className="my-4" />
      <h2 className="h4 mt-4 mb-3">Presentation List</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {presentations.length === 0 ? (
        <p className="text-muted">No presentations found.</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {presentations.map((presentation) => (
              <tr key={presentation._id}>
                <td>{presentation.title}</td>
                <td>{presentation.description}</td>
                <td>
                  {!presentation.hasEvaluated && presentation.status !== 'waiting' && (
                    <div>
                      <Button className="me-2" variant="primary" size="sm" onClick={() => handleEvaluate(presentation._id)}>
                        Evaluate
                      </Button>
                    </div>
                  )}
                  <Button variant="secondary" size="sm" onClick={() => handleDownload(presentation._id)}>
                    Download
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}
