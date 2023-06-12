const Evaluation = require('../models/Evaluation');
const Presentation = require('../models/presentation');

// Create Evaluation
async function createEvaluation(req, res) {
  try {
    const { id, evaluatorId, criteriaScores, feedback } = req.body;
    console.log(req.body);
    // Check if all required fields are present
    if (!id || !criteriaScores || criteriaScores.length === 0) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    // Check if criteria is present for each criteriaScore
    const hasMissingCriteria = criteriaScores.some((score) => !score.criteria);
    if (hasMissingCriteria) {
      return res.status(400).json({ error: 'Criteria missing for some scores' });
    }

    // Calculate overall score based on the average of criteria scores
    const overallScore = calculateOverallScore(criteriaScores);
    const newEvaluation = await Evaluation.create({
      presentation: id,
      evaluator: req.user._id,
      criteriaScores,
      overallScore,
      feedback
    });

    if (newEvaluation) {
      res.status(201).json({ evaluation: newEvaluation });
    } else {
      res.status(500).json({ error: 'Failed to create evaluation' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Helper function to calculate the overall score
function calculateOverallScore(criteriaScores) {
  if (criteriaScores.length === 0) {
    return null;
  }

  const sum = criteriaScores.reduce((total, { score }) => total + score, 0);
  const average = sum / criteriaScores.length;
  return Math.round(average * 10) / 10; // Round to 1 decimal place
}

// Get Evaluation by ID
async function getEvaluationById(req, res) {
  try {
    const { evaluationId } = req.params;
    const evaluation = await Evaluation.findById(evaluationId);
    if (!evaluation) {
      return res.status(404).json({ message: 'Evaluation not found' });
    }
    res.json({ evaluation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
async function getAllEvaluations(req, res) {
  res.status(200).json(res.advancedResults);
}

// Update Evaluation by ID
async function updateEvaluationById(req, res) {
  try {
    const { evaluationId } = req.params;
    const { presentation, evaluator, criteriaScores, overallScore, feedback } = req.body;
    const updatedEvaluation = await Evaluation.findByIdAndUpdate(
      evaluationId,
      {
        presentation,
        evaluator,
        criteriaScores,
        overallScore,
        feedback
      },
      { new: true }
    );
    if (!updatedEvaluation) {
      return res.status(404).json({ message: 'Evaluation not found' });
    }
    res.json({ evaluation: updatedEvaluation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Delete Evaluation by ID
async function deleteEvaluationById(req, res) {
  try {
    const { evaluationId } = req.params;
    const deletedEvaluation = await Evaluation.findByIdAndRemove(evaluationId);
    if (!deletedEvaluation) {
      return res.status(404).json({ message: 'Evaluation not found' });
    }
    res.json({ message: 'Evaluation deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { getAllEvaluations, createEvaluation, getEvaluationById, updateEvaluationById, deleteEvaluationById };
