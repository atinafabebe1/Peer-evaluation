const csv = require('csv-parser');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const sendEmail = require('../utils/sendEmail');
const async = require('async');

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
  console.log(req.body);
  try {
    const { username, password } = req.body;

    // Check if the user exists in the database
    const user = await User.findOne({ username: username });
    if (!user) {
      console.log('no user');
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Check if the password is correct
    const match = await user.matchPassword(password);
    if (!match) {
      console.log('not matched');
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Create a JWT token for authentication
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

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

    const sendEmails = async.queue(async (row, callback) => {
      try {
        const email = row.email;

        // Check if the user already exists with the given email as username
        const existingUser = await User.findOne({ username: email });
        if (existingUser) {
          console.log(`User with username ${email} already exists. Skipping...`);
          callback();
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
        console.log(password);
        console.log(savedUser.username);
        let subject = 'Your Account Credentials';
        let text = `Username: ${savedUser.username}\nPassword: ${password}`;
        // Send an email to the student with the username and password
        await sendEmail(email, subject, text);

        callback();
      } catch (error) {
        callback(error);
      }
    }, 10); // Limit the number of concurrent email sends to 10

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('error', (error) => {
        console.error('CSV Parsing Error:', error);
        res.status(500).json({ error: 'Error parsing CSV file' });
      })
      .on('data', (row) => {
        sendEmails.push(row);
      })
      .on('end', () => {
        sendEmails.drain(() => {
          console.log('Emails sent successfully');
          res.json({ message: 'Emails sent successfully', users });
        });
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
