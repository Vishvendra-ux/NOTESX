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

const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Explicitly reject any attempt to escalate privilege during registration
    if (req.body.role && req.body.role.toLowerCase() === 'admin') {
      return res.status(403).json({ message: 'Registration with administrative privileges is prohibited' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const userExists = await User.findOne({ email: cleanEmail });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Public registration ALWAYS assigns the 'student' role
    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      role: 'student',
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

// @desc    Google Sign In / Verified Sign-in
// @route   POST /api/auth/google
// @access  Public
const googleLogin = async (req, res) => {
  const { credential, token, idToken, name, email, picture } = req.body;

  try {
    let verifiedEmail = null;
    let verifiedName = name;
    let verifiedPicture = picture;

    const rawToken = credential || token || idToken;

    if (rawToken) {
      // 1. Cryptographically verify token with Google
      try {
        const ticket = await googleClient.verifyIdToken({
          idToken: rawToken,
          audience: process.env.GOOGLE_CLIENT_ID || undefined
        });
        const payload = ticket.getPayload();
        verifiedEmail = payload.email ? payload.email.toLowerCase().trim() : null;
        verifiedName = payload.name || verifiedName;
        verifiedPicture = payload.picture || verifiedPicture;
      } catch (tokenErr) {
        // Fallback check against Google tokeninfo endpoint
        try {
          const resp = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(rawToken)}`);
          if (resp.ok) {
            const data = await resp.json();
            if (process.env.GOOGLE_CLIENT_ID && data.aud !== process.env.GOOGLE_CLIENT_ID) throw new Error('aud mismatch');
            verifiedEmail = data.email ? data.email.toLowerCase().trim() : null;
            verifiedName = data.name || verifiedName;
            verifiedPicture = data.picture || verifiedPicture;
          }
        } catch (_) {}
      }
    }

    // In development mode only: allow explicit demo student accounts ONLY, NEVER allow impersonating arbitrary or admin accounts!
    if (!verifiedEmail) {
      const isDevDemo = process.env.NODE_ENV !== 'production' && process.env.ENABLE_DEMO_USER === 'true' && email && (
        email.toLowerCase().trim() === 'student.demo@notesx.edu' ||
        email.toLowerCase().trim() === 'student.google@gmail.com'
      );
      if (isDevDemo) {
        verifiedEmail = email.toLowerCase().trim();
        verifiedName = verifiedName || (verifiedEmail === 'student.demo@notesx.edu' ? 'Demo Student' : 'Google Student');
      } else {
        return res.status(401).json({
          message: 'Valid Google identity credential token is required. Account impersonation is strictly prohibited.'
        });
      }
    }

    let user = await User.findOne({ email: verifiedEmail });

    if (!user) {
      const dummyPassword = await bcrypt.hash(Date.now().toString() + Math.random().toString(), 10);
      user = await User.create({
        name: verifiedName || 'Google Learner',
        email: verifiedEmail,
        password: dummyPassword,
        role: 'student',
        profilePhoto: verifiedPicture || '',
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
