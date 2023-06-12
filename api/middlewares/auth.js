const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('./async');

//Protect Routes
const Auth = asyncHandler(async (req, res, next) => {
  // verify user is authenticated

  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // Extract token from authorization header
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new ErrorResponse('Not authroized to access this route', 401));
  }

  try {
    //verify token

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select({
      username: 1,
      role: 1,
      _id: 1
    });
    next();
  } catch (error) {
    return next(new ErrorResponse('Not authroized to access this route', 401));
  }
});

const Authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`, 403));
    }
    next();
  };
};

module.exports = {
  Auth,
  Authorize
};
