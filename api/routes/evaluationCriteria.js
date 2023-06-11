const express = require('express');
const router = express.Router();
const evaluationCriteriaController = require('../controllers/evaluationCriteria');

router.post('/', evaluationCriteriaController.createEvaluationCriteria);

router.get('/', evaluationCriteriaController.getEvaluationCriteria);

router.get('/:id', evaluationCriteriaController.getEvaluationCriteriaById);

router.put('/:id', evaluationCriteriaController.updateEvaluationCriteria);

router.delete('/:id', evaluationCriteriaController.deleteEvaluationCriteria);

module.exports = router;
