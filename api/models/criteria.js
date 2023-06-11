const mongoose = require('mongoose');

const evaluationCriteriaSchema = new mongoose.Schema({
  criteria: {
    type: String,
    required: true
  },
  weightage: {
    type: Number,
    required: true
  }
});

const EvaluationCriteria = mongoose.model('EvaluationCriteria', evaluationCriteriaSchema);

module.exports = EvaluationCriteria;
