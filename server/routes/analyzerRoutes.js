import express from 'express';
import { analyzeJobDescription } from '../controllers/analyzerController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.post('/job-description', analyzeJobDescription);

export default router;
