import React, { useState, useEffect } from 'react';
import { Form, Button, Badge } from 'react-bootstrap';
import { FaStar, FaRegStar } from 'react-icons/fa';

export default function EvaluationForm({ addEvaluation, editEvaluation, selectedEvaluation, resetEvaluation }) {
  const [criteria, setCriteria] = useState('');
  const [score, setScore] = useState('');
  const [faceEmoji, setFaceEmoji] = useState('');

  useEffect(() => {
    setFaceEmoji(getFaceEmoji(score));
  }, [score]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedEvaluation) {
      const updatedEvaluation = { ...selectedEvaluation, criteria, score };
      editEvaluation(selectedEvaluation, updatedEvaluation);
    } else {
      const newEvaluation = { criteria, score };
      addEvaluation(newEvaluation);
    }

    resetForm();
  };

  const resetForm = () => {
    setCriteria('');
    setScore('');
    resetEvaluation();
  };

  const handleScoreChange = (newScore) => {
    setScore(newScore);
  };

  const getScoreBadgeVariant = (score) => {
    if (score >= 4) {
      return 'success';
    } else if (score >= 3) {
      return 'warning';
    } else {
      return 'danger';
    }
  };

  const getFaceEmoji = (score) => {
    if (score >= 4) {
      return '😊'; // Smiley face
    } else if (score >= 3) {
      return '😐'; // Neutral face
    } else {
      return '😠'; // Angry face
    }
  };

  const renderStars = () => {
    const filledStars = Math.round(score);
    const emptyStars = 5 - filledStars;
    const stars = [];

    for (let i = 0; i < filledStars; i++) {
      stars.push(
        <FaStar
          key={i}
          className="star-icon filled"
          onClick={() => handleScoreChange(i + 1)}
          role="button"
          tabIndex="0"
          aria-label={`Rate ${i + 1} star`}
        />
      );
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <FaRegStar
          key={filledStars + i}
          className="star-icon"
          onClick={() => handleScoreChange(filledStars + i + 1)}
          role="button"
          tabIndex="0"
          aria-label={`Rate ${filledStars + i + 1} star`}
        />
      );
    }

    return stars;
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="criteria">
        <Form.Label className="form-label">Criteria</Form.Label>
        <Form.Control type="text" placeholder="Enter evaluation criteria" value={criteria} onChange={(e) => setCriteria(e.target.value)} required />
      </Form.Group>

      <Form.Group controlId="score">
        <Form.Label className="form-label">Score (1-5)</Form.Label>
        <div className="star-rating d-flex " role="group" aria-label="Rating">
          <p className="pe-3">{renderStars()}</p>
          <p>{faceEmoji}</p>
        </div>
      </Form.Group>

      <Button variant="primary" type="submit" disabled={!criteria || score === ''} className="submit-button">
        {selectedEvaluation ? 'Save Changes' : 'Add Evaluation'}
      </Button>
      {selectedEvaluation && (
        <Button variant="secondary" className="cancel-button" onClick={resetForm}>
          Cancel
        </Button>
      )}
    </Form>
  );
}
