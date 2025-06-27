const opentracing = require('opentracing');
const jaeger = require('jaeger-client');

/**
 * OpenTracing Configuration with Jaeger
 * 
 * This module provides distributed tracing capabilities using OpenTracing
 * and Jaeger for monitoring and troubleshooting distributed systems.
 * 
 * Features:
 * - Request tracing across service boundaries
 * - Performance analysis and bottleneck identification
 * - Error tracking and debugging
 * - Dependency mapping
 */

let tracer;

/**
 * Setup tracing configuration
 * Initializes the Jaeger tracer with appropriate configuration
 */
function setupTracing() {
  const config = {
    serviceName: 'roman-numeral-converter',
    sampler: {
      type: 'probabilistic',
      param: 1.0 // Sample 100% of traces
    },
    reporter: {
      logSpans: true,
      agentHost: process.env.JAEGER_AGENT_HOST || 'localhost',
      agentPort: process.env.JAEGER_AGENT_PORT || 6832
    }
  };
  
  const options = {
    logger: {
      info: function(msg) {
        console.log('INFO:', msg);
      },
      error: function(msg) {
        console.log('ERROR:', msg);
      }
    }
  };
  
  tracer = jaeger.initTracer(config, options);
  opentracing.initGlobalTracer(tracer);
  
  console.log('Tracing system initialized with Jaeger');
}

/**
 * Create a new span for tracking operations
 * 
 * @param {string} operationName - Name of the operation being traced
 * @param {Object} parentSpan - Parent span (optional)
 * @param {Object} tags - Additional tags for the span
 * @returns {Object} The created span
 */
function createSpan(operationName, parentSpan = null, tags = {}) {
  if (!tracer) {
    console.warn('Tracer not initialized, skipping span creation');
    return null;
  }
  
  const spanOptions = {
    tags: {
      'component': 'roman-numeral-converter',
      'version': '1.0.0',
      ...tags
    }
  };
  
  if (parentSpan) {
    spanOptions.childOf = parentSpan;
  }
  
  return tracer.startSpan(operationName, spanOptions);
}

/**
 * Create a span for HTTP requests
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
function traceHttpRequest(req, res, next) {
  if (!tracer) {
    return next();
  }
  
  const span = createSpan('http_request', null, {
    'http.method': req.method,
    'http.url': req.url,
    'http.headers': JSON.stringify(req.headers),
    'http.query': JSON.stringify(req.query),
    'http.body': JSON.stringify(req.body)
  });
  
  // Store span in request object for later use
  req.span = span;
  
  // Override res.end to finish the span
  const originalEnd = res.end;
  res.end = function(...args) {
    if (span) {
      span.setTag('http.status_code', res.statusCode);
      span.finish();
    }
    originalEnd.apply(this, args);
  };
  
  next();
}

/**
 * Create a span for Roman numeral conversion
 * 
 * @param {number} input - The input number
 * @param {Object} parentSpan - Parent span (optional)
 * @returns {Object} The created span
 */
function traceRomanConversion(input, parentSpan = null) {
  return createSpan('roman_conversion', parentSpan, {
    'roman.input': input,
    'roman.input_range': getInputRange(input)
  });
}

/**
 * Add error information to a span
 * 
 * @param {Object} span - The span to add error to
 * @param {Error} error - The error object
 */
function addErrorToSpan(span, error) {
  if (span && error) {
    span.setTag('error', true);
    span.log({
      event: 'error',
      'error.object': error,
      message: error.message,
      stack: error.stack
    });
  }
}

/**
 * Add performance data to a span
 * 
 * @param {Object} span - The span to add performance data to
 * @param {string} operation - The operation name
 * @param {number} duration - Duration in milliseconds
 */
function addPerformanceToSpan(span, operation, duration) {
  if (span) {
    span.setTag(`${operation}.duration_ms`, duration);
    span.log({
      event: 'performance',
      operation: operation,
      duration: duration
    });
  }
}

/**
 * Get input range category for tracing
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
 * Extract trace context from headers (for distributed tracing)
 * 
 * @param {Object} headers - HTTP headers
 * @returns {Object} Span context
 */
function extractSpanContext(headers) {
  if (!tracer) {
    return null;
  }
  
  try {
    return tracer.extract(opentracing.FORMAT_HTTP_HEADERS, headers);
  } catch (error) {
    console.warn('Failed to extract span context:', error.message);
    return null;
  }
}

/**
 * Inject trace context into headers (for distributed tracing)
 * 
 * @param {Object} span - The span to inject
 * @param {Object} headers - HTTP headers object
 */
function injectSpanContext(span, headers) {
  if (!tracer || !span) {
    return;
  }
  
  try {
    tracer.inject(span, opentracing.FORMAT_HTTP_HEADERS, headers);
  } catch (error) {
    console.warn('Failed to inject span context:', error.message);
  }
}

/**
 * Close the tracer (useful for graceful shutdown)
 */
function closeTracer() {
  if (tracer) {
    tracer.close();
    console.log('Tracer closed');
  }
}

module.exports = {
  setupTracing,
  createSpan,
  traceHttpRequest,
  traceRomanConversion,
  addErrorToSpan,
  addPerformanceToSpan,
  extractSpanContext,
  injectSpanContext,
  closeTracer
}; 