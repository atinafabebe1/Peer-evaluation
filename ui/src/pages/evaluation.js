import React, { useState, useEffect } from 'react';
import { Button, Container, Table, Alert } from 'react-bootstrap';
import EvaluationForm from '../components/evaluation/Criteria';
import api from '../api/api';

export default function Evaluation() {
  const [evaluations, setEvaluations] = useState([]);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [error, setError] = useState(null);
  const [index, setIndex] = useState(null);

  useEffect(() => {
    fetchEvaluations();
  }, []);

  const fetchEvaluations = async () => {
    try {
      const response = await api.get('/api/evaluation-criteria');

      const data = response.data;
      console.log(response);
      setEvaluations(data);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch evaluations:', error);
      setError('Failed to fetch evaluations. Please try again later.');
    }
  };

  const addEvaluation = async (evaluation) => {
    try {
      const weightage = evaluation.weightage;
      const evaluationWithWeightage = { ...evaluation, weightage };

      const response = await api.post('/api/evaluation-criteria', { evaluation });
      console.log(response);
      const data = response.data;
      setEvaluations([...evaluations, data]);
      setError(null);
    } catch (error) {
      console.error('Failed to add evaluation:', error);
      setError('Failed to add evaluation. Please try again later.');
    }
  };

  const editEvaluation = async (evaluation, updatedEvaluation) => {
    try {
      const evaluationId = evaluation._id;
      const weightage = updatedEvaluation.weightage;
      const evaluationWithWeightage = { ...updatedEvaluation, weightage };

      const response = await api.put(`/api/evaluation-criteria/${evaluationId}`, evaluationWithWeightage);
      console.log(response);
      const data = response.data;
      const updatedEvaluations = [...evaluations];
      updatedEvaluations[index] = data;
      setEvaluations(updatedEvaluations);
      setSelectedEvaluation(null);
      setError(null);
    } catch (error) {
      console.error('Failed to edit evaluation:', error);
      setError('Failed to edit evaluation. Please try again later.');
    }
  };

  const deleteEvaluation = async (index) => {
    try {
      const evaluationId = evaluations[index]._id;
      const response = await api.delete(`/api/evaluation-criteria/${evaluationId}`);

      const updatedEvaluations = [...evaluations];
      updatedEvaluations.splice(index, 1);
      setEvaluations(updatedEvaluations);
      setSelectedEvaluation(null);
      setError(null);
    } catch (error) {
      console.error('Failed to delete evaluation:', error);
      setError('Failed to delete evaluation. Please try again later.');
    }
  };

  const selectEvaluation = (index) => {
    setSelectedEvaluation(evaluations[index]);
    setIndex(index);
    setError(null);
  };

  const resetEvaluation = () => {
    setSelectedEvaluation(null);
    setError(null);
  };

  return (
    <Container className="">
      <EvaluationForm
        addEvaluation={addEvaluation}
        editEvaluation={editEvaluation}
        selectedEvaluation={selectedEvaluation}
        resetEvaluation={resetEvaluation}
      />
      <hr className="my-2" />
      <h2 className="h4 mt-4 mb-2">Evaluation List</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {evaluations.length === 0 ? (
        <p className="text-muted">No evaluations found.</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Criteria</th>
              <th>Weightage</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {evaluations.map((evaluation, index) => (
              <tr key={evaluation._id}>
                <td>{evaluation.criteria}</td>
                <td>{evaluation.weightage}</td>
                <td>
                  <Button variant="outline-primary" size="sm" className="me-2" onClick={() => selectEvaluation(index)}>
                    Edit
                  </Button>
                  <Button variant="outline-danger" size="sm" onClick={() => deleteEvaluation(index)}>
                    Delete
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
