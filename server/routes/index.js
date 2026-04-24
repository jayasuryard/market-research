const express = require('express');
const router = express.Router();

/**
 * API Routes Index
 * Import and register all route modules here
 */

// Import route modules
const exampleRoutes = require('./route');

// Register routes
router.use('/example', exampleRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString() 
  });
});

module.exports = router;
