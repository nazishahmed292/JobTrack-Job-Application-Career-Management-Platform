import Interview from '../models/Interview.js';
import Application from '../models/Application.js';
import Notification from '../models/Notification.js';
import asyncHandler from '../utils/asyncHandler.js';

const getInterviews = asyncHandler(async (req, res) => {
  const interviews = await Interview.find({ user: req.user._id }).populate('application').sort({ date: 1 });
  return res.status(200).json({ success: true, interviews });
});

const createInterview = asyncHandler(async (req, res) => {
  const { application, interviewType, date, time, meetingUrl, interviewer, notes } = req.body;

  const app = await Application.findOne({ _id: application, user: req.user._id });
  if (!app) {
    return res.status(404).json({ success: false, message: 'Application not found' });
  }

  const interview = await Interview.create({
    user: req.user._id,
    application,
    interviewType,
    date,
    time,
    meetingUrl,
    interviewer,
    notes,
  });

  await Notification.create({
    user: req.user._id,
    title: 'Interview scheduled',
    message: `Your ${interviewType.toLowerCase()} interview for ${app.companyName} is on ${new Date(date).toDateString()}.`,
    type: 'interview',
  });

  return res.status(201).json({ success: true, interview });
});

const updateInterview = asyncHandler(async (req, res) => {
  const interview = await Interview.findOne({ _id: req.params.id, user: req.user._id });

  if (!interview) {
    return res.status(404).json({ success: false, message: 'Interview not found' });
  }

  Object.assign(interview, req.body);
  await interview.save();

  return res.status(200).json({ success: true, interview });
});

const deleteInterview = asyncHandler(async (req, res) => {
  const interview = await Interview.findOne({ _id: req.params.id, user: req.user._id });

  if (!interview) {
    return res.status(404).json({ success: false, message: 'Interview not found' });
  }

  await interview.deleteOne();
  return res.status(200).json({ success: true, message: 'Interview deleted successfully' });
});

export { getInterviews, createInterview, updateInterview, deleteInterview };
