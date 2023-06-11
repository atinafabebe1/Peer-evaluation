const EvaluationCriteria = require('../models/criteria');

const createEvaluationCriteria = async (req, res) => {
  try {
    console.log(req.body);
    const { criteria, weightage } = req.body;

    const newCriteria = new EvaluationCriteria({
      criteria,
      weightage
    });

    const savedCriteria = await newCriteria.save();

    res.status(201).json(savedCriteria);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create evaluation criteria' });
  }
};

const getEvaluationCriteria = async (req, res) => {
  console.log(req.body);
  try {
    const criteria = await EvaluationCriteria.find();
    res.status(200).json(criteria);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve evaluation criteria' });
  }
};

const getEvaluationCriteriaById = async (req, res) => {
  try {
    const { id } = req.params;

    const criteria = await EvaluationCriteria.findById(id);

    if (!criteria) {
      return res.status(404).json({ error: 'Evaluation criteria not found' });
    }

    res.status(200).json(criteria);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve evaluation criteria' });
  }
};

const updateEvaluationCriteria = async (req, res) => {
  console.log(req.body);

  try {
    const { id } = req.params;
    const { criteria, weightage } = req.body;

    const updatedCriteria = await EvaluationCriteria.findByIdAndUpdate(id, { criteria, weightage }, { new: true });

    console.log(updatedCriteria);

    if (!updatedCriteria) {
      return res.status(404).json({ error: 'Evaluation criteria not found' });
    }

    res.status(200).json(updatedCriteria);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update evaluation criteria' });
  }
};

const deleteEvaluationCriteria = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCriteria = await EvaluationCriteria.findByIdAndDelete(id);

    if (!deletedCriteria) {
      return res.status(404).json({ error: 'Evaluation criteria not found' });
    }

    res.status(200).json({ message: 'Evaluation criteria deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete evaluation criteria' });
  }
};

module.exports = {
  createEvaluationCriteria,
  getEvaluationCriteria,
  getEvaluationCriteriaById,
  updateEvaluationCriteria,
  deleteEvaluationCriteria
};
