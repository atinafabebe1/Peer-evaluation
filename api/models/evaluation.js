const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema(
  {
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
      type: Number
      // required: true
    },
    feedback: {
      type: String
    }
  },
  { timestamps: true }
);

// Check if the model already exists before defining it
const Evaluation = mongoose.models.Evaluation || mongoose.model('Evaluation', evaluationSchema);

module.exports = Evaluation;
