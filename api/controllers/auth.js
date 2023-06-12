const csv = require('csv-parser');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const sendEmail = require('../utils/sendEmail');

// User Registration
async function registerUser(req, res) {
  try {
    const { username, password, role, email, firstName, lastName, dateOfBirth, address, phoneNumber } = req.body;

    // Check if the username or email already exists in the database
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(409).json({ message: 'Username or email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
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

// User Login
async function loginUser(req, res) {
  try {
    const { username, password } = req.body;

    // Check if the user exists in the database
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Check if the password is correct
    const match = await user.matchPassword(password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Create a JWT token for authentication
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Send credentials to students from CSV file
async function sendCredentialsToStudents(req, res) {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: 'File not provided' });
    }

    const users = [];

    const sendEmails = [];
    const csvStream = fs.createReadStream(req.file.path).pipe(csv());

    csvStream.on('data', async (row) => {
      try {
        const email = row.email;

        // Check if the user already exists with the given email as username
        const existingUser = await User.findOne({ username: email });
        if (existingUser) {
          console.log(`User with username ${email} already exists. Skipping...`);
          return;
        }

        // Generate a random password for each student
        const password = generateRandomPassword();

        // Create a new user with the email as the username and the generated password
        const newUser = new User({
          username: email,
          password,
          role: 'student',
          email
        });

        // Save the new user to the database
        const savedUser = await newUser.save();
        users.push(savedUser);

        let subject = 'Your Account Credentials';
        let text = `Username: ${savedUser.username}\nPassword: ${password}`;
        console.log('email');
        // Push the email sending task to the queue
        sendEmails.push(sendEmail(email, subject, text));
      } catch (error) {
        console.error('Error occurred while processing row:', error);
      }
    });

    csvStream.on('end', async () => {
      try {
        // Wait for all the email sending tasks to complete
        await Promise.all(sendEmails);

        console.log('Emails sent successfully');
        res.json({ message: 'Emails sent successfully', users });
      } catch (error) {
        console.error('Error occurred during email sending:', error);
        res.status(500).json({ error: error.message });
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
}

function generateRandomPassword() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters[randomIndex];
  }
  return password;
}

module.exports = { registerUser, loginUser, sendCredentialsToStudents };
