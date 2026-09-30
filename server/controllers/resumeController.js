import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Resume from '../models/Resume.js';
import asyncHandler from '../utils/asyncHandler.js';

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['.pdf', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (!allowed.includes(ext)) {
    return cb(new Error('Only PDF, DOC, and DOCX files are allowed'), false);
  }

  if (file.size > 5 * 1024 * 1024) {
    return cb(new Error('File size must be under 5MB'), false);
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const getResumes = asyncHandler(async (req, res) => {
  const resumes = await Resume.find({ user: req.user._id }).sort({ createdAt: -1 });
  return res.status(200).json({ success: true, resumes });
});

const uploadResume = asyncHandler(async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ success: false, message: 'Please upload a valid resume file' });
  }

  const existing = await Resume.find({ user: req.user._id });
  const resume = await Resume.create({
    user: req.user._id,
    fileName: file.filename,
    originalName: file.originalname,
    mimeType: file.mimetype,
    path: `/uploads/${file.filename}`,
    size: file.size,
    isPrimary: existing.length === 0,
  });

  return res.status(201).json({ success: true, resume });
});

const deleteResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });

  if (!resume) {
    return res.status(404).json({ success: false, message: 'Resume not found' });
  }

  if (fs.existsSync(path.join(process.cwd(), 'uploads', resume.fileName))) {
    fs.unlinkSync(path.join(process.cwd(), 'uploads', resume.fileName));
  }

  await resume.deleteOne();
  return res.status(200).json({ success: true, message: 'Resume deleted successfully' });
});

const setPrimaryResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });

  if (!resume) {
    return res.status(404).json({ success: false, message: 'Resume not found' });
  }

  await Resume.updateMany({ user: req.user._id }, { $set: { isPrimary: false } });
  resume.isPrimary = true;
  await resume.save();

  return res.status(200).json({ success: true, resume });
});

export { upload, getResumes, uploadResume, deleteResume, setPrimaryResume };
