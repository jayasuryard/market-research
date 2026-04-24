import express from 'express';
const router = express.Router();

/**
 * API Routes Index
 * Import and register all route modules here
 */

// Import route modules
import exampleRoutes from './route.js';
import validationRoutes from './validation.routes.js';

// Register routes
router.use('/example', exampleRoutes);
router.use('/validation', validationRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString() 
  });
});

export default router;
