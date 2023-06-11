const mongoose = require('mongoose');

const presentationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    presenter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
      // required: true
    },
    slides: {
      type: String,
      required: true
    },
    audio: {
      type: String
    },
    video: {
      type: String
    },
    scheduledFor: {
      type: Date
    },
    evaluationCriteria: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EvaluationCriteria'
      }
    ],
    status: {
      type: String,
      enum: ['completed', 'onprogress', 'removed', 'waiting'],
      default: 'waiting'
    }
  },
  { timestamps: true }
);

const Presentation = mongoose.model('Presentation', presentationSchema);

module.exports = Presentation;
