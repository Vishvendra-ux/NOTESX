const College = require('../models/College');
const escapeRegex = require('../utils/escapeRegex');

exports.list = async (req, res, next) => {
  try {
    const { search = '', state } = req.query;
    const filter = search ? { $or: ['name', 'city', 'state', 'location'].map((field) => ({ [field]: { $regex: escapeRegex(search), $options: 'i' } })) } : {};
    if (state) filter.state = state;
    res.json(await College.find(filter).sort({ name: 1 }));
  } catch (error) { next(error); }
};
exports.get = async (req, res, next) => { try { const college = await College.findById(req.params.id); if (!college) return res.status(404).json({ message: 'College not found' }); res.json(college); } catch (error) { next(error); } };
exports.create = async (req, res, next) => { try { res.status(201).json(await College.create(req.body)); } catch (error) { next(error); } };
