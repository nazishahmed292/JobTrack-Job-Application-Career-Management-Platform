import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Application from '../models/Application.js';
import Interview from '../models/Interview.js';
import Notification from '../models/Notification.js';
import Activity from '../models/Activity.js';

dotenv.config();

const seed = async () => {
  try {
    await connectDB();

    await User.deleteMany({});
    await Application.deleteMany({});
    await Interview.deleteMany({});
    await Notification.deleteMany({});
    await Activity.deleteMany({});

    const password = await bcrypt.hash('password123', 10);
    const user = await User.create({
      fullName: 'Demo User',
      email: 'demo@jobtrack.app',
      password,
      skills: ['React', 'JavaScript', 'Node.js', 'MongoDB', 'Tailwind'],
      location: 'Remote',
      professionalSummary: 'Product-minded full-stack developer focused on frontend systems and hiring workflows.',
    });

    const apps = await Application.insertMany([
      {
        user: user._id,
        companyName: 'Northstar Labs',
        jobTitle: 'Frontend Engineer',
        status: 'Interview',
        location: 'Remote',
        workType: 'Remote',
        employmentType: 'Full-time',
        salary: '$130k',
        applicationDate: new Date(),
        jobDescription: 'Build UI systems and create SaaS dashboards.',
        recruiterName: 'Sarah Lee',
        recruiterEmail: 'sarah@northstarlabs.com',
        tags: ['frontend', 'react'],
      },
      {
        user: user._id,
        companyName: 'AetherWorks',
        jobTitle: 'Full Stack Developer',
        status: 'Applied',
        location: 'New York, NY',
        workType: 'Hybrid',
        employmentType: 'Full-time',
        salary: '$145k',
        applicationDate: new Date(Date.now() - 7 * 86400000),
        jobDescription: 'Work on APIs, web apps, and internal tooling.',
      },
    ]);

    for (const app of apps) {
      const activity = await Activity.create({
        user: user._id,
        application: app._id,
        action: 'Application Created',
        details: `Application created for ${app.companyName}`,
      });
      app.activity = [activity._id];
      await app.save();
    }

    await Interview.create({
      user: user._id,
      application: apps[0]._id,
      interviewType: 'Video',
      date: new Date(Date.now() + 2 * 86400000),
      time: '10:00',
      interviewer: 'Alex Martin',
      notes: 'Portfolio walkthrough and technical discussion.',
    });

    await Notification.insertMany([
      {
        user: user._id,
        title: 'Interview tomorrow',
        message: 'Your interview with Northstar Labs is tomorrow at 10:00 AM.',
        type: 'interview',
      },
      {
        user: user._id,
        title: 'Profile updated',
        message: 'Your professional profile is now ready for recruiters.',
        type: 'profile',
        read: true,
      },
    ]);

    console.log('Seed complete: demo user and sample data created.');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
};

seed();
