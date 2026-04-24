import express from 'express';
const router = express.Router();
import ideaValidationController from '../modules/ideaValidation/ideaValidationController.js';

/**
 * Idea Validation Routes
 * Base path: /api/validation
 */

// AI predict target audience + pricing from idea description
router.post('/predict-context', ideaValidationController.predictContext.bind(ideaValidationController));

// Submit new idea for validation
router.post('/submit', ideaValidationController.submitIdea.bind(ideaValidationController));

// Provide clarification answers
router.post('/:id/clarify', ideaValidationController.provideClarification.bind(ideaValidationController));

// Start analysis process
router.post('/:id/analyze', ideaValidationController.startAnalysis.bind(ideaValidationController));

// Get analysis status
router.get('/:id/status', ideaValidationController.getStatus.bind(ideaValidationController));

// Get final validation report
router.get('/:id/report', ideaValidationController.getReport.bind(ideaValidationController));

// Get all submissions for a user
router.get('/user/:userId', ideaValidationController.getUserSubmissions.bind(ideaValidationController));

export default router;
