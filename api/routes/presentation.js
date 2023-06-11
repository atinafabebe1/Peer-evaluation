const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/auth');
const PresentationController = require('../controllers/presentation');
const PresentationModel = require('../models/presentation');
const advancedResult = require('../middlewares/advancedResult');
const multer = require('multer');
const path = require('path');
// Create a storage engine for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/files/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    cb(null, uniqueSuffix + fileExtension);
  }
});

// Create a file filter function to only allow mp3 files
const fileFilter = (req, file, cb) => {
  // if (file.mimetype === '.pptx') {
  cb(null, true);
  // } else {
  //   cb(new Error('Invalid file type. Only MP3 files are allowed.'), false);
  // }
};

// Create an upload instance of multer with the storage and file filter options
const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

// Create a new song with file upload
router.post('/', upload.single('presentationFile'), PresentationController.createPresentation);
// Presentation Routes
router.get('/', advancedResult(PresentationModel, ''), PresentationController.getAllPresentations);
router.put('/add/:id', PresentationController.addPresentationToSchedule);
router.put('/complete/:id', PresentationController.completePresentationToSchedule);
router.get('/:id', PresentationController.getPresentationById);
router.put('/:id', PresentationController.updatePresentationById);
router.delete('/:id', PresentationController.deletePresentationById);

module.exports = router;
