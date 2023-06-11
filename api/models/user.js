const mongoose = require('mongoose');
const bcrpyt = require('bcryptjs');
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'professor', 'evaluator'],
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  avatar: {
    type: String,
    default: 'default-avatar.jpg'
  },
  dateOfBirth: {
    type: Date
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  phoneNumber: {
    type: String
  }
});

//Hashing Password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcrpyt.hash(this.password, 11);
});
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrpyt.compare(enteredPassword, this.password);
};
const User = mongoose.model('User', userSchema);

module.exports = User;
