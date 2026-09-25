const College = require('../models/College');
const CommunityPost = require('../models/CommunityPost');
const CampusEvent = require('../models/CampusEvent');
const User = require('../models/User');

// Get College Details by slug or ID
exports.getCollegeDetails = async (req, res, next) => {
  try {
    const param = req.params.slugOrId.toLowerCase();
    let college = await College.findOne({ slug: param });
    
    if (!college && param.match(/^[0-9a-fA-F]{24}$/)) {
      college = await College.findById(param);
    }

    if (!college) {
      return res.status(404).json({ message: 'College community not found' });
    }

    res.json(college);
  } catch (error) {
    next(error);
  }
};

// Get Posts for a specific college
exports.getCollegePosts = async (req, res, next) => {
  try {
    const { slugOrId } = req.params;
    let college = await College.findOne({ slug: slugOrId.toLowerCase() });
    if (!college && slugOrId.match(/^[0-9a-fA-F]{24}$/)) {
      college = await College.findById(slugOrId);
    }

    const query = college ? { collegeId: college._id } : { collegeSlug: slugOrId.toLowerCase() };
    const posts = await CommunityPost.find(query).sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    next(error);
  }
};

// Create a new post in campus feed
exports.createCollegePost = async (req, res, next) => {
  try {
    const { slugOrId } = req.params;
    const { title, content, tag } = req.body;

    let college = await College.findOne({ slug: slugOrId.toLowerCase() });
    if (!college && slugOrId.match(/^[0-9a-fA-F]{24}$/)) {
      college = await College.findById(slugOrId);
    }

    if (!college) {
      return res.status(404).json({ message: 'College not found' });
    }

    const post = await CommunityPost.create({
      collegeId: college._id,
      collegeSlug: college.slug,
      author: req.user ? req.user.name : (req.body.author || 'Student Member'),
      authorId: req.user ? req.user._id : null,
      role: req.user ? (req.user.course || 'Campus Student') : 'CSE Student',
      title,
      content,
      tag: tag || 'General',
    });

    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};

// Upvote a community post
exports.upvotePost = async (req, res, next) => {
  try {
    const post = await CommunityPost.findByIdAndUpdate(
      req.params.postId,
      { $inc: { upvotes: 1 } },
      { new: true }
    );
    res.json(post);
  } catch (error) {
    next(error);
  }
};

// Delete a community post (Admin Moderation)
exports.deleteCollegePost = async (req, res, next) => {
  try {
    const post = await CommunityPost.findByIdAndDelete(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    console.log(`🗑️ Admin deleted post: ${req.params.postId}`);
    res.json({ message: 'Post deleted successfully by Admin moderation' });
  } catch (error) {
    next(error);
  }
};

// Get Events for a college
exports.getCollegeEvents = async (req, res, next) => {
  try {
    const { slugOrId } = req.params;
    let college = await College.findOne({ slug: slugOrId.toLowerCase() });
    if (!college && slugOrId.match(/^[0-9a-fA-F]{24}$/)) {
      college = await College.findById(slugOrId);
    }

    const query = college ? { collegeId: college._id } : { collegeSlug: slugOrId.toLowerCase() };
    const events = await CampusEvent.find(query).sort({ createdAt: -1 });

    res.json(events);
  } catch (error) {
    next(error);
  }
};

// Get College Leaderboard
exports.getCollegeLeaderboard = async (req, res, next) => {
  try {
    const { slugOrId } = req.params;
    let college = await College.findOne({ slug: slugOrId.toLowerCase() });
    if (!college && slugOrId.match(/^[0-9a-fA-F]{24}$/)) {
      college = await College.findById(slugOrId);
    }

    const query = college ? { collegeId: college._id } : {};
    const users = await User.find(query)
      .select('name year reputation badges profilePhoto')
      .sort({ reputation: -1 })
      .limit(10);

    res.json(users);
  } catch (error) {
    next(error);
  }
};
