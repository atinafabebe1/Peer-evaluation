require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const bodyParser = require('body-parser');
const winston = require('winston');
const { getDb, connectToDb } = require('./config/db');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

// Configure the Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console(), new winston.transports.File({ filename: 'combined.log' })]
});

// Log requests
app.use((req, res, next) => {
  logger.info(`Received ${req.method} request at ${req.originalUrl}`);
  next();
});

app.use(bodyParser.json());

const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const presentationRoutes = require('./routes/presentation');
const evaluationRoutes = require('./routes/evaluation');
const evaluationCriteria = require('./routes/evaluationCriteria');

// Register the route files
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/presentations', presentationRoutes);
app.use('/api/evaluations', evaluationRoutes);
app.use('/api/evaluation-criteria', evaluationCriteria);

// Connect to the database
connectToDb((err) => {
  if (err) {
    logger.error('Failed to connect to the database:', err);
    process.exit(1);
  }

  const db = getDb();

  app.get('/books', (req, res) => {
    res.json({ message: 'Welcome to the API' });
  });

  const server = app.listen(port, () => {
    logger.info(`App listening on port ${port}`);
    logger.info('Connected to the database');
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    logger.info('Received SIGTERM. Shutting down gracefully...');
    server.close(() => {
      logger.info('Server has closed.');
      process.exit(0);
    });
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Unhandled promise rejection
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Promise Rejection:', reason);
});

// Uncaught exception
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});
