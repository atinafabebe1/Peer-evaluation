import React, { useState, useEffect } from 'react';
import { Table, Badge, Pagination, Button, Alert, Toast } from 'react-bootstrap';
import axios from 'axios';
import Rating from 'react-rating-stars-component';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/api';

export default function EvaluationForm() {
  const { id } = useParams();
  const [evaluations, setEvaluations] = useState([]);
  const [criteriaScores, setCriteriaScores] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const evaluationsPerPage = 5;
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvaluations();
  }, []);

  useEffect(() => {
    const allCriteriaCompleted =
      criteriaScores.length > 0 && criteriaScores.every((score) => score.score !== undefined && score.score !== null && score.score !== '');
    setIsSubmitEnabled(allCriteriaCompleted);
  }, [criteriaScores]);

  const getScoreBadgeVariant = (score) => {
    if (score >= 4) {
      return 'success';
    } else if (score >= 3) {
      return 'warning';
    } else {
      return 'danger';
    }
  };

  const fetchEvaluations = async () => {
    try {
      const response = await api.get('/api/evaluation-criteria');
      console.log(response);
      const data = response.data;
      setEvaluations(data);
      setCriteriaScores(data.map((criteria) => ({ criteria: criteria._id, score: undefined })));
    } catch (error) {
      console.error('Failed to fetch evaluations:', error);
    }
  };

  const handleScoreChange = (index, score) => {
    const updatedScores = [...criteriaScores];
    updatedScores[index].score = score;
    setCriteriaScores(updatedScores);
  };

  const getEmoji = (score, weightage) => {
    const percentage = (score / weightage) * 100;
    if (percentage >= 80) {
      return '😄'; // happy face emoji
    } else if (percentage >= 50) {
      return '😐'; // neutral face emoji
    } else {
      return '😞'; // sad face emoji
    }
  };

  const indexOfLastEvaluation = currentPage * evaluationsPerPage;
  const indexOfFirstEvaluation = indexOfLastEvaluation - evaluationsPerPage;
  const currentEvaluations = evaluations.slice(indexOfFirstEvaluation, indexOfLastEvaluation);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmissionError(null);
    setIsSubmitEnabled(false);

    try {
      const response = await api.post('/api/evaluations', {
        id,
        criteriaScores
      });
      setSubmissionSuccess(true);
      setTimeout(() => {
        navigate('/peer-evaluation');
      }, 4000); // Delay the navigation by 2000 milliseconds (2 seconds)
    } catch (error) {
      console.error('Failed to send evaluations:', error);
      setSubmissionError('Failed to submit evaluations. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Evaluations</h1>
      {submissionSuccess && (
        <Toast show={submissionSuccess} onClose={() => setSubmissionSuccess(false)} className="position-fixed top-0 start-50 translate-middle-x mt-5">
          <Toast.Header closeButton={false} className="bg-success text-white">
            <strong className="me-auto">Success</strong>
          </Toast.Header>
          <Toast.Body className="bg-success text-white">
            Evaluations submitted successfully. Thank you! Navigating you back to the previous page.
          </Toast.Body>
        </Toast>
      )}

      {currentEvaluations.length === 0 ? (
        <p className="text-muted">No evaluations found.</p>
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead className="bg-dark text-white">
              <tr>
                <th>Criteria</th>
                <th>Score</th>
                <th>Rate</th>
              </tr>
            </thead>
            <tbody>
              {currentEvaluations.map((evaluation, index) => (
                <tr key={evaluation._id}>
                  <td>{evaluation.criteria}</td>
                  <td>
                    <Badge variant={getScoreBadgeVariant(criteriaScores[index].score)}>{criteriaScores[index].score || '-'}</Badge>
                  </td>
                  <td className="d-flex align-items-center">
                    <Rating
                      count={evaluation.weightage}
                      value={criteriaScores[index].score || 0}
                      onChange={(score) => handleScoreChange(index, score)}
                      size={24}
                      activeColor="#ffd700"
                    />
                    <p className="ms-3 mb-0">{getEmoji(criteriaScores[index].score, evaluation.weightage)}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination>
            {Array.from({ length: Math.ceil(evaluations.length / evaluationsPerPage) }).map((_, index) => (
              <Pagination.Item key={index + 1} active={currentPage === index + 1} onClick={() => paginate(index + 1)}>
                {index + 1}
              </Pagination.Item>
            ))}
          </Pagination>

          {submissionError && <Alert variant="danger">{submissionError}</Alert>}

          <Button variant="primary" size="sm" onClick={handleSubmit} disabled={!isSubmitEnabled || isSubmitting} className="mt-3">
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </>
      )}
    </div>
  );
}
