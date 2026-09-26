const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const formatUserResponse = (user, token) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  bio: user.bio,
  collegeName: user.collegeName,
  course: user.course,
  year: user.year,
  semester: user.semester,
  github: user.github,
  linkedin: user.linkedin,
  reputation: user.reputation,
  badges: user.badges,
  profilePhoto: user.profilePhoto,
  resume: user.resume,
  resumeOriginalName: user.resumeOriginalName,
  isVerified: user.isVerified,
  token,
});

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const cleanEmail = email ? email.toLowerCase().trim() : '';
    const userExists = await User.findOne({ email: cleanEmail });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: cleanEmail,
      password: hashedPassword,
      role: role || 'student',
    });

    if (user) {
      res.status(201).json(formatUserResponse(user, generateToken(user._id)));
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const cleanEmail = email ? email.toLowerCase().trim() : '';
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      console.log(`Login attempt failed: No user found with email '${cleanEmail}'`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      console.log(`Login successful for: ${user.email} (${user.role})`);
      res.json(formatUserResponse(user, generateToken(user._id)));
    } else {
      console.log(`Login attempt failed: Password mismatch for email '${cleanEmail}'`);
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Google Sign In / Auto Sign-in
// @route   POST /api/auth/google
// @access  Public
const googleLogin = async (req, res) => {
  const { name, email, picture } = req.body;

  try {
    const cleanEmail = email ? email.toLowerCase().trim() : 'google.student@gmail.com';
    let user = await User.findOne({ email: cleanEmail });

    if (!user) {
      const dummyPassword = await bcrypt.hash(Date.now().toString(), 10);
      user = await User.create({
        name: name || 'Google Learner',
        email: cleanEmail,
        password: dummyPassword,
        role: 'student',
        profilePhoto: picture || '',
        isVerified: true
      });
      console.log(`✅ New user registered via Google Sign-in: ${user.email}`);
    } else {
      console.log(`✅ Existing user logged in via Google Sign-in: ${user.email}`);
    }

    res.json(formatUserResponse(user, generateToken(user._id)));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login, googleLogin, getMe };
