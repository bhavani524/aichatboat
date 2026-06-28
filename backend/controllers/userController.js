// backend/controllers/userController.js
const User = require('../models/User');

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json({ status: 'success', user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { ...(name && { name }) },
      { new: true, runValidators: true },
    );
    res.json({ status: 'success', user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    next(err);
  }
};