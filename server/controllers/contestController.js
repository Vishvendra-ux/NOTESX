const Contest = require('../models/Contest');
exports.list = async (req, res, next) => { try { const filter = req.query.status ? { status: req.query.status } : {}; res.json(await Contest.find(filter).populate('collegeId', 'name logo').sort({ startTime: 1 })); } catch (error) { next(error); } };
exports.get = async (req, res, next) => { try { const contest = await Contest.findById(req.params.id).populate('collegeId', 'name logo'); if (!contest) return res.status(404).json({ message: 'Contest not found' }); res.json(contest); } catch (error) { next(error); } };
exports.create = async (req, res, next) => { try { res.status(201).json(await Contest.create(req.body)); } catch (error) { next(error); } };
