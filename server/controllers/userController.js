const User = require('../models/User');

exports.me = async (req, res, next) => { 
  try { 
    res.json(await User.findById(req.user._id).select('-password').populate('collegeId', 'name location')); 
  } catch (error) { 
    next(error); 
  } 
};

exports.profile = async (req, res, next) => { 
  try { 
    const user = await User.findOne({ 
      $or: [
        { email: req.params.username }, 
        { name: new RegExp(`^${req.params.username.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
      ] 
    }).select('-password').populate('collegeId', 'name location'); 
    
    if (!user) return res.status(404).json({ message: 'Student not found' }); 
    res.json(user); 
  } catch (error) { 
    next(error); 
  } 
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, bio, collegeName, course, year, semester, github, linkedin, profilePhoto } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (collegeName) user.collegeName = collegeName;
    if (course) user.course = course;
    if (year) user.year = year;
    if (semester) user.semester = semester;
    if (github !== undefined) user.github = github;
    if (linkedin !== undefined) user.linkedin = linkedin;
    if (profilePhoto) user.profilePhoto = profilePhoto;

    await user.save();

    const updatedUser = await User.findById(user._id).select('-password');
    console.log(`✅ Profile updated for: ${updatedUser.email}`);
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

exports.uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a valid resume file (PDF, DOC, DOCX)' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.resume = fileUrl;
    user.resumeOriginalName = req.file.originalname;
    await user.save();

    const updatedUser = await User.findById(user._id).select('-password');
    console.log(`📄 Resume successfully uploaded for ${updatedUser.email}: ${fileUrl}`);
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

exports.deleteResume = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.resume = '';
    user.resumeOriginalName = '';
    await user.save();

    const updatedUser = await User.findById(user._id).select('-password');
    console.log(`🗑️ Resume deleted for ${updatedUser.email}`);
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};
