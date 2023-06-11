const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema({
  presentation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Presentation',
    required: true
  },
  evaluator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  criteriaScores: [
    {
      criteria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EvaluationCriteria',
        required: true
      },
      score: {
        type: Number,
        required: true
      },
      comment: {
        type: String
      }
    }
  ],
  overallScore: {
    type: Number,
    required: true
  },
  feedback: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const Evaluation = mongoose.model('Evaluation', evaluationSchema);

module.exports = Evaluation;
