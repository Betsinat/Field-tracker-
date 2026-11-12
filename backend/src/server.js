const dotenv = require('dotenv');

dotenv.config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const issueRoutes = require('./modules/issues/presentation/routes/issueRoutes');

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.use('/api/reports', issueRoutes);

app.use((req, res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const statusCode =
    Number.isInteger(error.status) && error.status >= 400 && error.status < 600
      ? error.status
      : 500;

  console.error('Unhandled request error:', error);

  return res.status(statusCode).json({
    message: statusCode < 500 ? error.message : 'Internal server error.',
  });
});

const startServer = async () => {
  try {
    await connectDB();

    const port = process.env.PORT || 5000;
    const server = app.listen(port, () => {
      console.info(`Server running on port ${port}.`);
    });

    server.on('error', (error) => {
      console.error('HTTP server failed to start:', error);
      process.exitCode = 1;
    });
  } catch (error) {
    console.error('Server startup failed:', error);
    process.exitCode = 1;
  }
};

startServer();
