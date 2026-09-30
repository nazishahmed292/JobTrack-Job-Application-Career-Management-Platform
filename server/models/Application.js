import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    jobTitle: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    jobDescription: {
      type: String,
      default: '',
    },
    jobUrl: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    workType: {
      type: String,
      enum: ['Remote', 'Hybrid', 'On-site'],
      default: 'Remote',
    },
    employmentType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Internship', 'Contract'],
      default: 'Full-time',
    },
    salary: {
      type: String,
      default: '',
    },
    applicationDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['Wishlist', 'Applied', 'Screening', 'Interview', 'Offer', 'Rejected', 'Withdrawn'],
      default: 'Wishlist',
    },
    recruiterName: {
      type: String,
      default: '',
    },
    recruiterEmail: {
      type: String,
      default: '',
    },
    recruiterPhone: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
    },
    activity: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity',
      },
    ],
  },
  {
    timestamps: true,
  }
);

applicationSchema.index({ user: 1, status: 1, companyName: 1 });

const Application = mongoose.model('Application', applicationSchema);

export default Application;
