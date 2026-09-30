import express from 'express';
import { getResumes, uploadResume, deleteResume, setPrimaryResume, upload } from '../controllers/resumeController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.get('/', getResumes);
router.post('/', upload.single('resume'), uploadResume);
router.delete('/:id', deleteResume);
router.patch('/:id/primary', setPrimaryResume);

export default router;
