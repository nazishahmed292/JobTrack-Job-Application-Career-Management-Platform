import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      required: true,
      index: true,
    },
    interviewType: {
      type: String,
      enum: ['Phone', 'Video', 'Technical', 'HR', 'Final'],
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      default: '',
    },
    meetingUrl: {
      type: String,
      default: '',
    },
    interviewer: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Interview = mongoose.model('Interview', interviewSchema);

export default Interview;
