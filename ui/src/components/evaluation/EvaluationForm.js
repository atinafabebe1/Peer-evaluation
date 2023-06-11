import React, { useState, useEffect } from 'react';
import { Table, Badge, Pagination } from 'react-bootstrap';
import axios from 'axios';
import Rating from 'react-rating-stars-component';

export default function EvaluationForm({ addEvaluation, editEvaluation, selectedEvaluation, resetEvaluation }) {
  const [evaluations, setEvaluations] = useState([]);
  const [criteriaScores, setCriteriaScores] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const evaluationsPerPage = 5;

  useEffect(() => {
    fetchEvaluations();
  }, []);

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
      const response = await axios.get('http://localhost:3500/api/evaluation-criteria');
      console.log(response);
      const data = response.data;
      setEvaluations(data);
    } catch (error) {
      console.error('Failed to fetch evaluations:', error);
    }
  };

  const handleScoreChange = (criteriaId, score) => {
    setCriteriaScores((prevScores) => ({
      ...prevScores,
      [criteriaId]: score
    }));
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

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Evaluations</h1>
      {currentEvaluations.length === 0 ? (
        <p>No evaluations found.</p>
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
              {currentEvaluations.map((evaluation) => (
                <tr key={evaluation._id}>
                  <td>{evaluation.criteria}</td>
                  <td>
                    <Badge variant={getScoreBadgeVariant(criteriaScores[evaluation._id])}>{criteriaScores[evaluation._id] || '-'}</Badge>
                  </td>
                  <td className="d-flex ">
                    <Rating
                      count={evaluation.weightage}
                      value={criteriaScores[evaluation._id] || 0}
                      onChange={(score) => handleScoreChange(evaluation._id, score)}
                      size={24}
                      activeColor="#ffd700"
                    />
                    <p className="ms-3 pt-1">{getEmoji(criteriaScores[evaluation._id], evaluation.weightage)}</p>
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
        </>
      )}
    </div>
  );
}
