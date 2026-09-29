const Roadmap = require('../models/Roadmap');

// @desc    List all roadmaps with filters & search
// @route   GET /api/roadmaps
// @access  Public
exports.list = async (req, res, next) => {
  try {
    const { category, difficulty, search, tag, type } = req.query;
    const query = {};

    if (type && type !== 'All' && type !== 'All Roadmaps') {
      query.roadmapType = type;
    }

    if (category && category !== 'All' && category !== 'All Domains') {
      query.category = category;
    }

    if (difficulty && difficulty !== 'All' && difficulty !== 'All Levels') {
      query.difficulty = difficulty;
    }

    if (tag) {
      query.tags = { $in: [new RegExp(tag, 'i')] };
    }

    if (search && search.trim()) {
      const s = search.trim();
      query.$or = [
        { title: { $regex: s, $options: 'i' } },
        { subtitle: { $regex: s, $options: 'i' } },
        { description: { $regex: s, $options: 'i' } },
        { tags: { $in: [new RegExp(s, 'i')] } },
        { careerPaths: { $in: [new RegExp(s, 'i')] } }
      ];
    }

    const roadmaps = await Roadmap.find(query)
      .select('slug title subtitle description category difficulty estimatedDuration icon color tags salaryRange careerPaths stages views roadmapType')
      .sort({ featured: -1, views: -1, createdAt: 1 })
      .lean();

    // Map roadmaps to include summary count of stages and nodes
    const formatted = roadmaps.map(r => ({
      ...r,
      totalStages: r.stages?.length || 0,
      totalNodes: r.stages?.reduce((acc, stage) => acc + (stage.nodes?.length || 0), 0) || 0
    }));

    res.json(formatted);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single roadmap by slug or id
// @route   GET /api/roadmaps/:idOrSlug
// @access  Public
exports.get = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;
    let roadmap;

    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      roadmap = await Roadmap.findByIdAndUpdate(idOrSlug, { $inc: { views: 1 } }, { new: true });
    } else {
      roadmap = await Roadmap.findOneAndUpdate({ slug: idOrSlug }, { $inc: { views: 1 } }, { new: true });
    }

    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap not found' });
    }

    // Related roadmaps in the same or adjacent category
    const related = await Roadmap.find({
      _id: { $ne: roadmap._id },
      category: roadmap.category
    })
      .select('slug title subtitle category difficulty estimatedDuration icon color')
      .limit(3)
      .lean();

    res.json({
      ...roadmap.toObject(),
      related
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get roadmap categories with counts
// @route   GET /api/roadmaps/categories
// @access  Public
exports.categories = async (req, res, next) => {
  try {
    const categories = await Roadmap.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json(categories.map(c => ({ name: c._id, count: c.count })));
  } catch (error) {
    next(error);
  }
};
