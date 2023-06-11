const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middlewares/auth');
const UserController = require('../controllers/user');

// User Routes
// router.get('/', auth, authorize(['admin']), UserController.getAllUsers);
router.get('/:id', UserController.getUserById);
// router.post('/', auth, authorize(['admin']), UserController.createUser);
// router.put('/:id', auth, authorize(['admin']), UserController.updateUser);
// router.delete('/:id', auth, authorize(['admin']), UserController.deleteUser);

module.exports = router;
