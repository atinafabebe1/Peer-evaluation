const Evaluation = require('../models/Evaluation');

// Create Evaluation
async function createEvaluation(req, res) {
  console.log(req.body);
  try {
    const { presentation, evaluator, criteriaScores, overallScore, feedback } = req.body;
    const newEvaluation = new Evaluation({
      presentation,
      evaluator,
      criteriaScores,
      overallScore,
      feedback
    });
    const evaluation = await newEvaluation.save();
    res.status(201).json({ evaluation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
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
  try {
    const evaluation = await Evaluation.find({});

    res.json({ evaluation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
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
