const promClient = require('prom-client');

/**
 * Prometheus Metrics Configuration
 * 
 * This module provides comprehensive metrics collection for the Roman numeral converter
 * application using the Prometheus client library.
 * 
 * Metrics collected:
 * - HTTP request duration and counts
 * - Roman numeral conversion operations
 * - Error rates and types
 * - Application health metrics
 */

// Create a Prometheus registry
const register = new promClient.Registry();

// Add default metrics (CPU, memory, etc.)
promClient.collectDefaultMetrics({ register });

// Custom metrics
const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});

const httpRequestTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

const romanConversionTotal = new promClient.Counter({
  name: 'roman_conversion_total',
  help: 'Total number of Roman numeral conversions',
  labelNames: ['status', 'input_range']
});

const romanConversionDuration = new promClient.Histogram({
  name: 'roman_conversion_duration_seconds',
  help: 'Duration of Roman numeral conversion in seconds',
  labelNames: ['status'],
  buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1]
});

const errorTotal = new promClient.Counter({
  name: 'errors_total',
  help: 'Total number of errors',
  labelNames: ['type', 'context']
});

const activeConnections = new promClient.Gauge({
  name: 'active_connections',
  help: 'Number of active connections'
});

// Register all metrics
register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestTotal);
register.registerMetric(romanConversionTotal);
register.registerMetric(romanConversionDuration);
register.registerMetric(errorTotal);
register.registerMetric(activeConnections);

/**
 * Setup metrics collection for Express app
 * 
 * @param {Object} app - Express application instance
 */
function setupMetrics(app) {
  // Metrics endpoint for Prometheus scraping
  app.get('/metrics', async (req, res) => {
    try {
      res.set('Content-Type', register.contentType);
      res.end(await register.metrics());
    } catch (error) {
      res.status(500).end(error);
    }
  });
  
  // Middleware to collect HTTP metrics
  app.use((req, res, next) => {
    const start = Date.now();
    
    // Track active connections
    activeConnections.inc();
    
    // Override res.end to capture metrics
    const originalEnd = res.end;
    res.end = function(...args) {
      const duration = (Date.now() - start) / 1000; // Convert to seconds
      const route = req.route ? req.route.path : req.path;
      
      // Record metrics
      httpRequestDuration
        .labels(req.method, route, res.statusCode.toString())
        .observe(duration);
      
      httpRequestTotal
        .labels(req.method, route, res.statusCode.toString())
        .inc();
      
      // Decrease active connections
      activeConnections.dec();
      
      // Call original end method
      originalEnd.apply(this, args);
    };
    
    next();
  });
}

/**
 * Record Roman numeral conversion metrics
 * 
 * @param {number} input - The input number
 * @param {string} status - Success or error status
 * @param {number} duration - Conversion duration in milliseconds
 */
function recordRomanConversion(input, status, duration) {
  const inputRange = getInputRange(input);
  const durationSeconds = duration / 1000;
  
  romanConversionTotal
    .labels(status, inputRange)
    .inc();
  
  romanConversionDuration
    .labels(status)
    .observe(durationSeconds);
}

/**
 * Record error metrics
 * 
 * @param {string} type - Error type (validation, conversion, server, etc.)
 * @param {string} context - Error context (api, middleware, etc.)
 */
function recordError(type, context) {
  errorTotal
    .labels(type, context)
    .inc();
}

/**
 * Get input range category for metrics
 * 
 * @param {number} input - The input number
 * @returns {string} Range category
 */
function getInputRange(input) {
  if (input <= 10) return '1-10';
  if (input <= 50) return '11-50';
  if (input <= 100) return '51-100';
  if (input <= 500) return '101-500';
  if (input <= 1000) return '501-1000';
  if (input <= 2000) return '1001-2000';
  return '2001-3999';
}

/**
 * Get current metrics as JSON
 * 
 * @returns {Promise<Object>} Current metrics data
 */
async function getMetrics() {
  const metrics = await register.getMetricsAsJSON();
  return metrics;
}

/**
 * Reset all metrics (useful for testing)
 */
function resetMetrics() {
  register.clear();
}

module.exports = {
  setupMetrics,
  recordRomanConversion,
  recordError,
  getMetrics,
  resetMetrics,
  register
}; 