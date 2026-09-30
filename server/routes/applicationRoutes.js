import express from 'express';
import {
  getApplications,
  createApplication,
  getApplicationById,
  updateApplication,
  deleteApplication,
  updateApplicationStatus,
} from '../controllers/applicationController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.get('/', getApplications);
router.post('/', createApplication);
router.get('/:id', getApplicationById);
router.put('/:id', updateApplication);
router.delete('/:id', deleteApplication);
router.patch('/:id/status', updateApplicationStatus);

export default router;
