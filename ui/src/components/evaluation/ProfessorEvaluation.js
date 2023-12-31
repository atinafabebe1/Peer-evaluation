import React, { useState, useEffect, useContext } from 'react';
import { Container, Table, Alert, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { UserContext } from '../../context/userContext.js';
export default function ProfessorPresentation() {
  const { user } = useContext(UserContext);
  const [presentations, setPresentation] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPresentations();
  }, []);

  const fetchPresentations = async () => {
    try {
      const response = await api.get('/api/presentations?status=waiting&status=onprogress');
      const data = response.data?.data;
      console.log(data);
      for (const presentation of data) {
        console.log(user);
        console.log(presentation);
        const evaluationResponse = await api.get(`/api/evaluations?presentation=${presentation._id}&evaluator=${user.id}`);
        const evaluationData = evaluationResponse.data;

        presentation.hasEvaluated = evaluationData.count > 0;
      }

      setPresentation(data);

      setError(null);
    } catch (error) {
      console.error('Failed to fetch presentations:', error);
      setError('Failed to fetch presentations. Please try again later.');
    }
  };

  const handleAddToSchedule = async (presentationId) => {
    try {
      const response = await api.put(`/api/presentations/add/${presentationId}`, {});
      console.log(response);
      const data = response.data.presentation;

      const updatedPresentations = presentations.map((pres) => {
        if (pres._id === data._id) {
          return data;
        }
        return pres;
      });
      setPresentation(updatedPresentations);
      setError(null);
    } catch (error) {
      console.error('Failed to edit presentation:', error);
      setError('Failed to edit presentation. Please try again later.');
    }
  };
  const handleEvaluate = async (presentationId) => {
    const presentation = presentations.find((presentation) => presentation._id === presentationId);

    if (!presentation.hasEvaluated && presentation.status !== 'waiting') {
      navigate(`/evaluate/${presentationId}`);
    }
  };

  const handleComplete = async (presentationId) => {
    try {
      const response = await api.put(`/api/presentations/complete/${presentationId}`, {});
      console.log(response);
      const data = response.data.presentation;

      const updatedPresentations = presentations.filter((pres) => pres._id !== data._id);
      setPresentation(updatedPresentations);
      setError(null);
    } catch (error) {
      console.error('Failed to edit presentation:', error);
      setError('Failed to edit presentation. Please try again later.');
    }
  };

  return (
    <Container className="mt-5">
      <h1 className="display-4 text-center mb-4">Professor Evaluation</h1>
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
                  {presentation?.status === 'waiting' ? (
                    <Button variant="outline-success" size="sm" onClick={() => handleAddToSchedule(presentation._id)}>
                      Add to schedule
                    </Button>
                  ) : (
                    <div>
                      {!presentation.hasEvaluated && presentation.status !== 'waiting' && (
                        <div>
                          <Button className="me-2" variant="primary" size="sm" onClick={() => handleEvaluate(presentation._id)}>
                            Evaluate
                          </Button>
                        </div>
                      )}
                      <Button variant="outline-danger mx-2" size="sm" onClick={() => handleComplete(presentation._id)}>
                        Complete
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}
