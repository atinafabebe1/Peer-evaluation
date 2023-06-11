const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

// Middleware to authenticate the user
function auth(req, res, next) {
  try {
    // Get the authorization header
    const token = req.headers.authorization;

    // Check if the token exists
    if (!token) {
      return res.status(401).json({ message: 'Authorization token not found' });
    }

    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Check if the user exists in the database
    User.findById(decoded.userId, (err, user) => {
      if (err || !user) {
        return res.status(401).json({ message: 'Unauthorized access' });
      }

      // Attach the user object to the request
      req.user = user;

      // Continue to the next middleware
      next();
    });
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized access' });
  }
}

// Middleware to authorize user roles
function authorize(roles) {
  return (req, res, next) => {
    // Check if the user role is in the allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden access' });
    }

    // Continue to the next middleware
    next();
  };
}

module.exports = { auth, authorize };
