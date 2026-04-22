// Restaurant Inspection System - Express Server
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
// CORS configuration - allow all origins in development (for workshop demo)
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, Postman, or file://)
    if (!origin) return callback(null, true);

    // In development, allow all origins
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }

    // In production, check against allowed origins
    const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || [];
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Serve static files from client and landing directories
app.use('/client', express.static(path.join(__dirname, '../client')));
app.use('/landing', express.static(path.join(__dirname, '../landing')));

// Redirect root to landing page
app.get('/', (req, res) => {
  res.redirect('/landing/index.html');
});

// API Routes
const authRoutes = require('./routes/auth');
const restaurantRoutes = require('./routes/restaurants');
const inspectionRequestRoutes = require('./routes/inspection-requests');
const inspectionRoutes = require('./routes/inspections');
const userRoutes = require('./routes/users');
const checklistItemsRoutes = require('./routes/checklist-items');

app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/inspection-requests', inspectionRequestRoutes);
app.use('/api/inspections', inspectionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/checklist-items', checklistItemsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log('=================================');
  console.log('Restaurant Inspection System');
  console.log('=================================');
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('');
  console.log('🌐 Application:');
  console.log(`   Landing:   http://localhost:${PORT}/`);
  console.log(`   Login:     http://localhost:${PORT}/client/login.html`);
  console.log(`   Dashboard: http://localhost:${PORT}/client/dashboard.html`);
  console.log('');
  console.log('🔧 API Endpoints:');
  console.log(`   Health:    http://localhost:${PORT}/api/health`);
  console.log(`   Auth:      http://localhost:${PORT}/api/auth/*`);
  console.log('=================================');
});
