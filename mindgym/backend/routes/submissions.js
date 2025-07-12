import express from 'express';
import { 
  submitCode, 
  getSubmissionStatus, 
  getUserSubmissions,
  getSubmissionCode,
  getSubmissionStats
} from '../controllers/submissionController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Submit code
router.post('/', submitCode);

// Get submission details
router.get('/stats', getSubmissionStats);
router.get('/user', getUserSubmissions);
router.get('/:id', getSubmissionStatus);
router.get('/:id/code', getSubmissionCode);

export default router;