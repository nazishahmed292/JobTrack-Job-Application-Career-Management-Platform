import Application from '../models/Application.js';
import Interview from '../models/Interview.js';
import Notification from '../models/Notification.js';
import asyncHandler from '../utils/asyncHandler.js';

const getDashboardAnalytics = asyncHandler(async (req, res) => {
  const applications = await Application.find({ user: req.user._id });
  const interviews = await Interview.find({ user: req.user._id });
  const notifications = await Notification.find({ user: req.user._id });

  const stats = {
    totalApplications: applications.length,
    activeApplications: applications.filter((app) => ['Applied', 'Screening', 'Interview', 'Wishlist'].includes(app.status)).length,
    interviews: interviews.length,
    offers: applications.filter((app) => app.status === 'Offer').length,
    rejectedApplications: applications.filter((app) => app.status === 'Rejected').length,
  };

  const applicationsOverTime = applications
    .sort((a, b) => new Date(a.applicationDate) - new Date(b.applicationDate))
    .map((app) => ({
      date: new Date(app.applicationDate).toISOString().slice(0, 10),
      count: 1,
    }));

  const statusData = Object.entries({
    Wishlist: 0,
    Applied: 0,
    Screening: 0,
    Interview: 0,
    Offer: 0,
    Rejected: 0,
    Withdrawn: 0,
  }).map(([status, count]) => {
    const matches = applications.filter((app) => app.status === status).length;
    return { name: status, value: matches };
  });

  const companyData = applications
    .reduce((acc, app) => {
      const existing = acc.find((item) => item.name === app.companyName);
      if (existing) {
        existing.value += 1;
      } else {
        acc.push({ name: app.companyName, value: 1 });
      }
      return acc;
    }, [])
    .slice(0, 6);

  const recentApplications = applications
    .sort((a, b) => new Date(b.applicationDate) - new Date(a.applicationDate))
    .slice(0, 5)
    .map((app) => ({
      _id: app._id,
      companyName: app.companyName,
      jobTitle: app.jobTitle,
      status: app.status,
      applicationDate: app.applicationDate,
    }));

  const upcomingInterviews = interviews
    .filter((interview) => new Date(interview.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5)
    .map((interview) => ({
      _id: interview._id,
      interviewType: interview.interviewType,
      date: interview.date,
      companyName: interview.application?.companyName || 'Company',
    }));

  return res.status(200).json({
    success: true,
    stats,
    applicationsOverTime,
    statusData,
    companyData,
    recentApplications,
    upcomingInterviews,
    notificationCount: notifications.filter((n) => !n.read).length,
  });
});

export { getDashboardAnalytics };
