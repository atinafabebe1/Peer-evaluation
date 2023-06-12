const Presentation = require('../models/presentation');
const { startOfMonth, endOfMonth } = require('date-fns');
const Evaluation = require('../models/Evaluation');
const path = require('path');
const fs = require('fs');
// Create Presentation
async function createPresentation(req, res) {
  console.log(req.file);
  try {
    const { title, description, presenter } = req.body;
    const newPresentation = new Presentation({
      title,
      description,
      presenter,
      slides: req.file?.filename
    });
    const presentation = await newPresentation.save();
    res.status(201).json({ presentation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
async function createReport(req, res) {
  const presentationId = req.params.id;

  try {
    // Retrieve all evaluations for the presentation
    const evaluations = await Evaluation.find({ presentation: presentationId })
      .populate('evaluator', 'username') // Populate evaluator's username
      .populate('criteriaScores.criteria', 'criteria'); // Populate criteria's name

    // Retrieve the presentation details
    const presentation = await Presentation.findById(presentationId);

    // Create the report object
    const report = {
      presentation: presentation.title,
      evaluations: []
    };

    // Process each evaluation
    evaluations.forEach((evaluation) => {
      const evaluatorName = evaluation.evaluator.username;

      // Calculate the average score for each criteria
      const criteriaScores = {};
      evaluation.criteriaScores.forEach((criteriaScore) => {
        const criteriaName = criteriaScore.criteria.criteria;
        if (!criteriaScores[criteriaName]) {
          criteriaScores[criteriaName] = {
            totalScore: 0,
            count: 0
          };
        }
        criteriaScores[criteriaName].totalScore += criteriaScore.score;
        criteriaScores[criteriaName].count++;
      });

      // Calculate the overall average score
      const overallScore =
        evaluation.criteriaScores.reduce((total, criteriaScore) => total + criteriaScore.score, 0) / evaluation.criteriaScores.length;

      // Add the evaluation details to the report
      report.evaluations.push({
        evaluator: evaluatorName,
        criteriaScores,
        overallScore,
        feedback: evaluation.feedback
      });
    });

    // Calculate the total score and total evaluators
    const totalScore = report.evaluations.reduce((total, evaluation) => total + evaluation.overallScore, 0);
    const totalEvaluators = report.evaluations.length;

    // Add the total score and total evaluators to the report
    report.totalScore = totalScore;
    report.totalEvaluators = totalEvaluators;

    res.status(200).json(report);
  } catch (error) {
    // Handle error
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
}

async function downloadPresentation(req, res, next) {
  try {
    const presentationId = req.params.id;

    // Retrieve the presentation from the database
    const presentation = await Presentation.findById(presentationId);

    if (!presentation) {
      return res.status(404).json({ success: false, error: 'Presentation not found' });
    }

    // Get the file path of the presentation
    const filePath = path.join(__dirname, '../uploads/files/', presentation.slides);

    // Check if the file exists
    if (fs.existsSync(filePath)) {
      // Set the appropriate headers for downloading
      res.setHeader('Content-Disposition', `attachment; filename=${presentation.slides}`);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');

      // Create a read stream from the file and pipe it to the response
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } else {
      return res.status(404).json({ success: false, error: 'Presentation file not found' });
    }
  } catch (error) {
    console.error('Failed to download presentation:', error);
    return res.status(500).json({ success: false, error: 'Failed to download presentation' });
  }
}

// Get Presentation by ID
async function getPresentationById(req, res) {
  try {
    const { presentationId } = req.params;
    const presentation = await Presentation.findById(presentationId);
    if (!presentation) {
      return res.status(404).json({ message: 'Presentation not found' });
    }
    res.json({ presentation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
async function getAllPresentations(req, res) {
  res.status(200).json(res.advancedResults);

  // const currentMonth = new Date();
  // console.log(currentMonth.setDate(0));
  // const startOfMonthDate = startOfMonth(currentMonth);
  // console.log(startOfMonthDate);
  // try {
  //   const presentation = await Presentation.find({});

  //   res.json({ presentation });
  // } catch (error) {
  //   res.status(500).json({ error: error.message });
  // }
}
async function addPresentationToSchedule(req, res) {
  const currentDate = new Date();

  try {
    const updatedPresentation = await Presentation.findByIdAndUpdate(
      req.params.id,
      { scheduledFor: currentDate, status: 'onprogress' },
      { new: true }
    );
    console.log(updatedPresentation);
    if (!updatedPresentation) {
      return res.status(404).json({ message: 'Presentation not found' });
    }
    res.status(200).json({ presentation: updatedPresentation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
async function completePresentationToSchedule(req, res) {
  try {
    const updatedPresentation = await Presentation.findByIdAndUpdate(req.params.id, { status: 'completed' }, { new: true });
    console.log(updatedPresentation);
    if (!updatedPresentation) {
      return res.status(404).json({ message: 'Presentation not found' });
    }
    res.status(200).json({ presentation: updatedPresentation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Update Presentation by ID
async function updatePresentationById(req, res) {
  try {
    const { presentationId } = req.params;
    const { title, description, presenter, slides, audio, video } = req.body;
    const updatedPresentation = await Presentation.findByIdAndUpdate(
      presentationId,
      {
        title,
        description,
        presenter,
        slides,
        audio,
        video
      },
      { new: true }
    );
    if (!updatedPresentation) {
      return res.status(404).json({ message: 'Presentation not found' });
    }
    res.json({ presentation: updatedPresentation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Delete Presentation by ID
async function deletePresentationById(req, res) {
  try {
    const { presentationId } = req.params;
    const deletedPresentation = await Presentation.findByIdAndRemove(presentationId);
    if (!deletedPresentation) {
      return res.status(404).json({ message: 'Presentation not found' });
    }
    res.json({ message: 'Presentation deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  completePresentationToSchedule,
  addPresentationToSchedule,
  getAllPresentations,
  createPresentation,
  getPresentationById,
  updatePresentationById,
  deletePresentationById,
  createReport,
  downloadPresentation
};
