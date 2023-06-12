import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Spinner, Alert, Card } from 'react-bootstrap';
import axios from 'axios';
import api from '../../api/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const PresentationReport = () => {
  const { presentationId } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedEvaluator, setExpandedEvaluator] = useState(null);
  const [averageOverallScore, setAverageOverallScore] = useState(0);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);

      try {
        const response = await api.get(`/api/presentations/report/${presentationId}`);
        setReport(response.data);
        setError(null);
        calculateAverageOverallScore(response.data);
      } catch (error) {
        setError('An error occurred while fetching the report.');
      }

      setLoading(false);
    };

    fetchReport();
  }, [presentationId]);

  const calculateAverageOverallScore = (data) => {
    if (data && data.evaluations.length > 0) {
      const totalScore = data.evaluations.reduce((sum, evaluation) => sum + evaluation.overallScore, 0);
      const averageScore = totalScore / data.evaluations.length;
      setAverageOverallScore(averageScore);
    }
  };

  const toggleEvaluatorDetails = (index) => {
    if (expandedEvaluator === index) {
      setExpandedEvaluator(null);
    } else {
      setExpandedEvaluator(index);
    }
  };

  const getChartData = () => {
    return (
      report?.evaluations.map((evaluation) => ({
        evaluator: evaluation.evaluator,
        overallScore: evaluation.overallScore
      })) || []
    );
  };
  const renderTotalScore = () => {
    if (report && report.totalScore) {
      return (
        <div className="text-center total-score-container">
          <h3>Total Score</h3>
          <h2 className="total-score">{report.totalScore}</h2>
        </div>
      );
    }
    return null;
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <h1 className="text-center mb-5">Presentation Report</h1>
          {loading && <Spinner animation="border" variant="primary" className="d-block mx-auto" />}
          {error && (
            <Alert variant="danger" className="mt-4">
              {error}
            </Alert>
          )}
          {report && (
            <div>
              <h2 className="text-center mt-4 mb-4">{report.presentation}</h2>
              {renderTotalScore()}
              <p className="text-center mt-2">Total Evaluators: {report.totalEvaluators}</p>
              <h3 className="text-center mt-4 mb-3">Evaluations:</h3>
              {report.evaluations.length > 0 ? (
                <Card className="mb-4 shadow">
                  <Card.Body>
                    <BarChart width={600} height={400} data={getChartData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="evaluator" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="overallScore" fill="#4e98cc" stroke="#4e98cc" barSize={30} />
                    </BarChart>
                  </Card.Body>
                </Card>
              ) : (
                <p className="text-center mb-4">No evaluations found.</p>
              )}
              {averageOverallScore > 0 && (
                <div className="text-center">
                  <h3>Average Overall Score</h3>
                  <h2>{averageOverallScore.toFixed(2)}</h2>
                </div>
              )}
              {report.evaluations.map((evaluation, index) => (
                <Card key={index} className={`mb-4 ${expandedEvaluator === index ? 'expanded' : ''}`} onClick={() => toggleEvaluatorDetails(index)}>
                  <Card.Body>
                    <Card.Title className="mb-3">Evaluator: {evaluation.evaluator}</Card.Title>
                    {expandedEvaluator === index && (
                      <>
                        <Card.Text>Overall Score: {evaluation.overallScore}</Card.Text>
                        <Card.Title className="mt-4">Criteria Scores:</Card.Title>
                        {Object.entries(evaluation.criteriaScores).map(([criteria, scores]) => (
                          <div key={criteria} className="criteria-score-container">
                            <Card.Text>Criteria: {criteria}</Card.Text>
                            <Card.Text>Total Score: {scores.totalScore}</Card.Text>
                          </div>
                        ))}
                        {evaluation.feedback && (
                          <>
                            <hr className="feedback-divider mt-4 mb-3" />
                            <Card.Title>Feedback:</Card.Title>
                            <Card.Text>{evaluation.feedback}</Card.Text>
                          </>
                        )}
                      </>
                    )}
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default PresentationReport;
