import Notification from '../models/Notification.js';
import asyncHandler from '../utils/asyncHandler.js';

const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
  return res.status(200).json({ success: true, notifications });
});

const markNotificationRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOne({ _id: req.params.id, user: req.user._id });

  if (!notification) {
    return res.status(404).json({ success: false, message: 'Notification not found' });
  }

  notification.read = true;
  await notification.save();

  return res.status(200).json({ success: true, notification });
});

const markAllNotificationsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ user: req.user._id }, { $set: { read: true } });
  return res.status(200).json({ success: true, message: 'All notifications marked as read' });
});

export { getNotifications, markNotificationRead, markAllNotificationsRead };
