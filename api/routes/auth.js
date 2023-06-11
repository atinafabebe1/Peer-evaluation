const express = require('express');
const router = express.Router();
const multer = require('multer');
const { registerUser, loginUser, sendCredentialsToStudents } = require('../controllers/auth');
const { auth, authorize } = require('../middlewares/auth');

// Configure multer for file upload
const upload = multer({ dest: 'uploads/' });

// User Registration
router.post('/register', registerUser);

// User Login
router.post('/login', loginUser);

// Protected route to send credentials to students
router.post('/send-credentials', upload.single('csvFile'), sendCredentialsToStudents);

module.exports = router;
