const express = require('express');
const router = express.Router();
const { Auth } = require('../middlewares/auth');
const EvaluationController = require('../controllers/evaluation');
const Evaluation = require('../models/evaluation');
const advancedResult = require('../middlewares/advancedResult');

// Evaluation Routes
router.get('/', advancedResult(Evaluation, ''), EvaluationController.getAllEvaluations);
router.get('/:id', EvaluationController.getEvaluationById);
router.post('/', Auth, EvaluationController.createEvaluation);
router.put('/:id', EvaluationController.updateEvaluationById);
router.delete('/:id', EvaluationController.deleteEvaluationById);

module.exports = router;
