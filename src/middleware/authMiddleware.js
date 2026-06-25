module.exports = (req, res, next) => {
  const userId = req.headers['x-user-id'];
  const role = req.headers['x-user-role'] || 'user';

  if (!userId) {
    return res.status(401).json({ success: false, message: 'Authentication is required' });
  }

  req.user = {
    id: Number(userId),
    role,
  };

  return next();
};
