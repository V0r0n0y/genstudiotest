const winston = require('winston');
const path = require('path');

/**
 * Winston Logger Configuration
 * 
 * This module provides structured logging capabilities with multiple output formats
 * and log levels suitable for production environments.
 * 
 * Log Levels:
 * - error: 0 - Critical errors that require immediate attention
 * - warn: 1 - Warning conditions that should be investigated
 * - info: 2 - General information about application flow
 * - http: 3 - HTTP request logging
 * - verbose: 4 - Detailed information for debugging
 * - debug: 5 - Debug information
 * - silly: 6 - Extremely detailed debugging information
 */

// Custom format for structured logging
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaString = Object.keys(meta).length ? JSON.stringify(meta) : '';
    return `${timestamp} [${level.toUpperCase()}]: ${message} ${metaString}`;
  })
);

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { 
    service: 'roman-numeral-converter',
    version: '1.0.0'
  },
  transports: [
    // Console transport for development
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    
    // File transport for errors
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    
    // File transport for all logs
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ],
  
  // Handle uncaught exceptions and unhandled rejections
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/exceptions.log')
    })
  ],
  
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/rejections.log')
    })
  ]
});

/**
 * Setup logging configuration
 * Creates log directories and configures additional logging features
 */
function setupLogging() {
  const fs = require('fs');
  const logDir = path.join(__dirname, '../logs');
  
  // Create logs directory if it doesn't exist
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  
  // Log application startup
  logger.info('Logging system initialized', {
    logLevel: logger.level,
    logDir: logDir,
    nodeEnv: process.env.NODE_ENV || 'development'
  });
}

/**
 * Create a child logger with additional context
 * 
 * @param {string} context - The context for this logger (e.g., 'api', 'database')
 * @param {Object} additionalMeta - Additional metadata to include in all log entries
 * @returns {winston.Logger} A child logger instance
 */
function createChildLogger(context, additionalMeta = {}) {
  return logger.child({
    context,
    ...additionalMeta
  });
}

/**
 * Log performance metrics
 * 
 * @param {string} operation - The operation being measured
 * @param {number} duration - Duration in milliseconds
 * @param {Object} metadata - Additional metadata
 */
function logPerformance(operation, duration, metadata = {}) {
  logger.info('Performance measurement', {
    operation,
    duration,
    durationMs: duration,
    ...metadata
  });
}

/**
 * Log API request details
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {number} responseTime - Response time in milliseconds
 */
function logApiRequest(req, res, responseTime) {
  logger.info('API Request', {
    method: req.method,
    url: req.url,
    statusCode: res.statusCode,
    responseTime,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    query: req.query,
    body: req.body
  });
}

/**
 * Log error with context
 * 
 * @param {Error} error - The error object
 * @param {string} context - Context where the error occurred
 * @param {Object} metadata - Additional metadata
 */
function logError(error, context = 'general', metadata = {}) {
  logger.error('Application error', {
    error: {
      message: error.message,
      stack: error.stack,
      name: error.name
    },
    context,
    ...metadata
  });
}

module.exports = {
  logger,
  setupLogging,
  createChildLogger,
  logPerformance,
  logApiRequest,
  logError
}; 