import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';

const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');

  if (!user) {
    return res.status(404).json({ success: false, message: 'User profile not found' });
  }

  return res.status(200).json({ success: true, user });
});

const updateProfile = asyncHandler(async (req, res) => {
  const { fullName, phone, location, githubUrl, linkedinUrl, portfolioUrl, skills, professionalSummary } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User profile not found' });
  }

  user.fullName = fullName || user.fullName;
  user.phone = phone || '';
  user.location = location || '';
  user.githubUrl = githubUrl || '';
  user.linkedinUrl = linkedinUrl || '';
  user.portfolioUrl = portfolioUrl || '';
  user.skills = Array.isArray(skills) ? skills : user.skills;
  user.professionalSummary = professionalSummary || '';

  await user.save();

  return res.status(200).json({ success: true, user: await User.findById(req.user._id).select('-password') });
});

const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ success: false, message: 'Please fill in all password fields' });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long' });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ success: false, message: 'New passwords do not match' });
  }

  const user = await User.findById(req.user._id);
  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    return res.status(400).json({ success: false, message: 'Current password is incorrect' });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  return res.status(200).json({ success: true, message: 'Password updated successfully' });
});

const updatePreferences = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  const { theme, emailNotifications, interviewReminders } = req.body;
  user.preferences = {
    theme: theme || user.preferences.theme,
    emailNotifications: emailNotifications ?? user.preferences.emailNotifications,
    interviewReminders: interviewReminders ?? user.preferences.interviewReminders,
  };

  await user.save();
  return res.status(200).json({ success: true, preferences: user.preferences });
});

export { getProfile, updateProfile, updatePassword, updatePreferences };
