exports.ask = async (req, res) => {
  const prompt = String(req.body.message || req.body.prompt || '').trim();
  if (!prompt) return res.status(400).json({ message: 'A study question is required' });
  res.json({ message: `Let’s work through “${prompt}”. Start by identifying the core concept, then test it with a small example.`, provider: 'local-fallback' });
};
