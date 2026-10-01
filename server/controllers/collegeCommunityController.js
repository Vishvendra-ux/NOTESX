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

    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required to post in community' });
    }

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

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
      author: req.user.name,
      authorId: req.user._id,
      role: req.user.course || (req.user.role === 'admin' ? 'System Admin' : 'Campus Student'),
      title: title.trim(),
      content: content.trim(),
      tag: tag || 'General',
      upvotes: 1,
      upvotedBy: [req.user._id],
    });

    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};

// Upvote a community post (authenticated & duplicate-safe)
exports.upvotePost = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required to upvote' });
    }

    const post = await CommunityPost.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const alreadyUpvoted = post.upvotedBy && post.upvotedBy.some(id => id.equals(req.user._id));
    if (alreadyUpvoted) {
      post.upvotedBy = post.upvotedBy.filter(id => !id.equals(req.user._id));
      post.upvotes = Math.max(0, (post.upvotes || 1) - 1);
    } else {
      if (!post.upvotedBy) post.upvotedBy = [];
      post.upvotedBy.push(req.user._id);
      post.upvotes = (post.upvotes || 0) + 1;
    }

    await post.save();
    res.json(post);
  } catch (error) {
    next(error);
  }
};

// Delete a community post (Author or Admin only)
exports.deleteCollegePost = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const post = await CommunityPost.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const isAuthor = post.authorId && post.authorId.equals(req.user._id);
    const isAdmin = req.user.role === 'admin';

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await post.deleteOne();
    res.json({ message: 'Post deleted successfully' });
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
