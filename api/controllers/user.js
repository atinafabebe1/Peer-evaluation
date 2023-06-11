const User = require('../models/user');

// Create User
async function createUser(req, res) {
  try {
    const { username, password, role, email, firstName, lastName, dateOfBirth, address, phoneNumber } = req.body;
    const newUser = new User({
      username,
      password,
      role,
      email,
      firstName,
      lastName,
      dateOfBirth,
      address,
      phoneNumber
    });
    const user = await newUser.save();
    res.status(201).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get User by ID
async function getUserById(req, res) {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Update User by ID
async function updateUserById(req, res) {
  try {
    const { userId } = req.params;
    const { username, password, role, email, firstName, lastName, dateOfBirth, address, phoneNumber } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        username,
        password,
        role,
        email,
        firstName,
        lastName,
        dateOfBirth,
        address,
        phoneNumber
      },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Delete User by ID
async function deleteUserById(req, res) {
  try {
    const { userId } = req.params;
    const deletedUser = await User.findByIdAndRemove(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { createUser, getUserById, updateUserById, deleteUserById };
