const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { notFound, errorHandler } = require('./src/middleware/error.middleware');

// Load environment variables
dotenv.config();

// Import routes
const absenceRoutes = require('./src/routes/absence.routes');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Import database connection
const connectDB = require('./src/config/db.config');

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/absences', absenceRoutes);

// Default route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Gestion Internat API' });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
