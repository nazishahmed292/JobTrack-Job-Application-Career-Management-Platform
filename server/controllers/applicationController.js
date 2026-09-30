import Application from '../models/Application.js';
import Activity from '../models/Activity.js';
import Notification from '../models/Notification.js';
import asyncHandler from '../utils/asyncHandler.js';

const getApplications = asyncHandler(async (req, res) => {
  const { status, workType, employmentType, location, search } = req.query;

  const filter = { user: req.user._id };

  if (status) filter.status = status;
  if (workType) filter.workType = workType;
  if (employmentType) filter.employmentType = employmentType;
  if (location) filter.location = { $regex: location, $options: 'i' };
  if (search) {
    filter.$or = [
      { companyName: { $regex: search, $options: 'i' } },
      { jobTitle: { $regex: search, $options: 'i' } },
    ];
  }

  const applications = await Application.find(filter).sort({ applicationDate: -1 });
  return res.status(200).json({ success: true, applications });
});

const createApplication = asyncHandler(async (req, res) => {
  const payload = {
    ...req.body,
    user: req.user._id,
  };

  const application = await Application.create(payload);

  await Activity.create({
    user: req.user._id,
    application: application._id,
    action: 'Application Created',
    details: `Application created for ${application.companyName}`,
  });

  await Notification.create({
    user: req.user._id,
    title: 'Application added',
    message: `You added a new application at ${application.companyName}.`,
    type: 'status',
  });

  return res.status(201).json({ success: true, application });
});

const getApplicationById = asyncHandler(async (req, res) => {
  const application = await Application.findOne({ _id: req.params.id, user: req.user._id }).populate('activity');

  if (!application) {
    return res.status(404).json({ success: false, message: 'Application not found' });
  }

  return res.status(200).json({ success: true, application });
});

const updateApplication = asyncHandler(async (req, res) => {
  const application = await Application.findOne({ _id: req.params.id, user: req.user._id });

  if (!application) {
    return res.status(404).json({ success: false, message: 'Application not found' });
  }

  Object.assign(application, req.body);
  await application.save();

  await Activity.create({
    user: req.user._id,
    application: application._id,
    action: 'Application Updated',
    details: `Application details updated for ${application.companyName}`,
  });

  return res.status(200).json({ success: true, application });
});

const deleteApplication = asyncHandler(async (req, res) => {
  const application = await Application.findOne({ _id: req.params.id, user: req.user._id });

  if (!application) {
    return res.status(404).json({ success: false, message: 'Application not found' });
  }

  await application.deleteOne();
  return res.status(200).json({ success: true, message: 'Application deleted successfully' });
});

const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const application = await Application.findOne({ _id: req.params.id, user: req.user._id });

  if (!application) {
    return res.status(404).json({ success: false, message: 'Application not found' });
  }

  application.status = status;
  await application.save();

  const activity = await Activity.create({
    user: req.user._id,
    application: application._id,
    action: 'Status Changed',
    details: `Application moved to ${status}`,
  });

  if (application.activity) {
    application.activity.push(activity._id);
    await application.save();
  } else {
    application.activity = [activity._id];
    await application.save();
  }

  await Notification.create({
    user: req.user._id,
    title: 'Application status updated',
    message: `${application.companyName} is now in ${status}.`,
    type: 'status',
  });

  return res.status(200).json({ success: true, application });
});

export {
  getApplications,
  createApplication,
  getApplicationById,
  updateApplication,
  deleteApplication,
  updateApplicationStatus,
};
