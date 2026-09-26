const GateProgress = require('../models/GateProgress');

const dateKey = (date) => date.toISOString().slice(0, 10);
const dayBefore = (date) => {
  const previous = new Date(date);
  previous.setUTCDate(previous.getUTCDate() - 1);
  return dateKey(previous);
};

const ensureProgress = async (userId) => GateProgress.findOneAndUpdate(
  { userId },
  { $setOnInsert: { userId, topics: [], currentStreak: 0, longestStreak: 0, lastActiveDate: '' } },
  { new: true, upsert: true, setDefaultsOnInsert: true },
);

const toResponse = (progress) => {
  const now = new Date();
  const lastActiveIsCurrent = progress.lastActiveDate === dateKey(now) || progress.lastActiveDate === dayBefore(now);
  return {
    topics: progress.topics.map((topic) => ({
      topicId: topic.topicId,
      subjectId: topic.subjectId,
      status: topic.status,
      startedAt: topic.startedAt,
      completedAt: topic.completedAt || null,
      lastActivityAt: topic.lastActivityAt,
    })),
    currentStreak: lastActiveIsCurrent ? progress.currentStreak : 0,
    longestStreak: progress.longestStreak,
    lastActiveDate: progress.lastActiveDate,
  };
};

const validateIds = (req, res) => {
  const { topicId } = req.params;
  const { subjectId } = req.body || {};
  const idPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  if (!idPattern.test(topicId || '') || !idPattern.test(subjectId || '')) {
    res.status(400).json({ message: 'A valid topic and subject are required.' });
    return false;
  }
  return true;
};

const recordActivity = (progress, now) => {
  const today = dateKey(now);
  if (progress.lastActiveDate !== today) {
    progress.currentStreak = progress.lastActiveDate === dayBefore(now)
      ? progress.currentStreak + 1
      : 1;
    progress.longestStreak = Math.max(progress.longestStreak, progress.currentStreak);
    progress.lastActiveDate = today;
  }
};

exports.getProgress = async (req, res, next) => {
  try {
    const progress = await GateProgress.findOne({ userId: req.user._id });
    res.json(progress ? toResponse(progress) : {
      topics: [], currentStreak: 0, longestStreak: 0, lastActiveDate: '',
    });
  } catch (error) {
    next(error);
  }
};

const updateTopic = (action) => async (req, res, next) => {
  try {
    if (!validateIds(req, res)) return;
    const { topicId } = req.params;
    const { subjectId } = req.body;
    const now = new Date();
    const progress = await ensureProgress(req.user._id);
    let tracked = progress.topics.find((topic) => topic.topicId === topicId);

    if (tracked && tracked.subjectId !== subjectId) {
      return res.status(409).json({ message: 'This topic is already linked to a different subject.' });
    }
    if (!tracked && action === 'reopen') {
      return res.status(404).json({ message: 'Start this topic before reopening it.' });
    }

    if (!tracked) {
      tracked = { topicId, subjectId, status: 'in_progress', startedAt: now, lastActivityAt: now };
      progress.topics.push(tracked);
    }

    if (action === 'complete') {
      tracked.status = 'completed';
      tracked.completedAt = now;
    } else if (action === 'reopen') {
      tracked.status = 'in_progress';
      tracked.completedAt = undefined;
    } else if (tracked.status !== 'completed') {
      tracked.status = 'in_progress';
    }

    tracked.lastActivityAt = now;
    recordActivity(progress, now);
    await progress.save();
    res.json(toResponse(progress));
  } catch (error) {
    next(error);
  }
};

exports.startTopic = updateTopic('start');
exports.completeTopic = updateTopic('complete');
exports.reopenTopic = updateTopic('reopen');
