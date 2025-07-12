import express from 'express';
import { 
  getProblems, 
  getProblem, 
  createProblem, 
  updateProblem, 
  deleteProblem,
  getProblemStats 
} from '../controllers/problemController.js';
import { authenticateToken, requireAdmin, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Public routes (with optional auth for personalized data)
router.get('/', optionalAuth, getProblems);
router.get('/stats', getProblemStats);
router.get('/:id', optionalAuth, getProblem);

// Admin routes
router.post('/', authenticateToken, requireAdmin, createProblem);
router.put('/:id', authenticateToken, requireAdmin, updateProblem);
router.delete('/:id', authenticateToken, requireAdmin, deleteProblem);

export default router;