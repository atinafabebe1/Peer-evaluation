import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';

const EvaluationForm = ({ addEvaluation, editEvaluation, selectedEvaluation, resetEvaluation }) => {
  const [criteria, setCriteria] = useState('');
  const [weightage, setWeightage] = useState('');

  useEffect(() => {
    if (selectedEvaluation) {
      setCriteria(selectedEvaluation.criteria);
      setWeightage(parseFloat(selectedEvaluation.weightage));
    } else {
      setCriteria('');
      setWeightage('');
    }
  }, [selectedEvaluation]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (criteria.trim() !== '' && !isNaN(weightage)) {
      const evaluation = {
        criteria: criteria,
        weightage: weightage
      };
      console.log(selectedEvaluation);
      if (selectedEvaluation) {
        // If there's a selected evaluation, edit it
        editEvaluation(selectedEvaluation, evaluation);
      } else {
        // Otherwise, add a new evaluation
        addEvaluation(evaluation);
      }

      resetForm();
    }
  };

  const resetForm = () => {
    setCriteria('');
    setWeightage('');
    resetEvaluation();
  };

  return (
    <div className="p-4 bg-light border rounded">
      <h2 className="text-center mb-4">Evaluation Form</h2>
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col sm={8} className="mx-auto">
            <Form.Group controlId="criteriaInput">
              <Form.Label>Criteria</Form.Label>
              <Form.Control type="text" value={criteria} onChange={(e) => setCriteria(e.target.value)} placeholder="Enter a criteria..." required />
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={8} className="mx-auto">
            <Form.Group controlId="weightageInput">
              <Form.Label>Weightage</Form.Label>
              <Form.Control
                type="number"
                value={weightage}
                onChange={(e) => setWeightage(parseFloat(e.target.value))} // Convert to number
                placeholder="Enter a weightage..."
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col className="text-center">
            <Button variant="primary" type="submit" className="me-2">
              {selectedEvaluation ? 'Edit Evaluation' : 'Add Evaluation'}
            </Button>
            {selectedEvaluation && (
              <Button variant="secondary" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default EvaluationForm;
