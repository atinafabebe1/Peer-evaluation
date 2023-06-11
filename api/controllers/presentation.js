const Presentation = require('../models/presentation');
const { startOfMonth, endOfMonth } = require('date-fns');

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
  deletePresentationById
};
