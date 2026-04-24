const express = require('express');
require('dotenv').config();
const morgan = require('morgan');
const prisma = require('./prisma-client');
const routes = require('./routes');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(morgan('dev'));
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// API Routes
app.use('/api', routes);

// Start server with database connection check
const startServer = async () => {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database Connected');
    
    app.listen(port, () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

startServer();
