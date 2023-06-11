const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/auth');
const EvaluationController = require('../controllers/evaluation');

// Evaluation Routes
router.get('/', EvaluationController.getAllEvaluations);
router.get('/:id', EvaluationController.getEvaluationById);
router.post('/', EvaluationController.createEvaluation);
router.put('/:id', EvaluationController.updateEvaluationById);
router.delete('/:id', EvaluationController.deleteEvaluationById);

module.exports = router;
