/**
 * Simple Express server for Roman numeral conversion
 * This demonstrates the API functionality without external dependencies
 */

const http = require('http');
const url = require('url');

// Roman numeral conversion function
function convertToRoman(number) {
  // Validate input range
  if (number < 1 || number > 3999) {
    throw new Error(`Number ${number} is outside the valid range (1-3999)`);
  }
  
  if (!Number.isInteger(number)) {
    throw new Error(`Number ${number} must be an integer`);
  }
  
  // Define the Roman numeral symbols and their values
  const romanNumerals = [
    { value: 1000, symbol: 'M' },
    { value: 900, symbol: 'CM' },
    { value: 500, symbol: 'D' },
    { value: 400, symbol: 'CD' },
    { value: 100, symbol: 'C' },
    { value: 90, symbol: 'XC' },
    { value: 50, symbol: 'L' },
    { value: 40, symbol: 'XL' },
    { value: 10, symbol: 'X' },
    { value: 9, symbol: 'IX' },
    { value: 5, symbol: 'V' },
    { value: 4, symbol: 'IV' },
    { value: 1, symbol: 'I' }
  ];
  
  let result = '';
  let remaining = number;
  
  // Iterate through each Roman numeral symbol
  for (const { value, symbol } of romanNumerals) {
    // While the remaining number is greater than or equal to the current value
    while (remaining >= value) {
      result += symbol;
      remaining -= value;
    }
  }
  
  return result;
}

// Create HTTP server
const server = http.createServer((req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // Parse URL
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  
  // Health check endpoint
  if (path === '/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'OK',
      timestamp: new Date().toISOString()
    }));
    return;
  }
  
  // Roman numeral conversion endpoint
  if (path === '/romannumeral' && req.method === 'GET') {
    const { query } = parsedUrl.query;
    
    // Validate input
    if (!query) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Missing query parameter');
      return;
    }
    
    const number = parseInt(query, 10);
    
    if (isNaN(number)) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Invalid number format');
      return;
    }
    
    if (number < 1 || number > 3999) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Number must be between 1 and 3999');
      return;
    }
    
    try {
      const romanNumeral = convertToRoman(number);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        input: number.toString(),
        output: romanNumeral
      }));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal server error');
    }
    return;
  }
  
  // 404 for unknown endpoints
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not found');
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`🚀 Roman Numeral Converter API running on http://localhost:${PORT}`);
  console.log(`📋 Available endpoints:`);
  console.log(`   GET /health - Health check`);
  console.log(`   GET /romannumeral?query={number} - Convert to Roman numeral`);
  console.log(`\n🧪 Test examples:`);
  console.log(`   curl http://localhost:${PORT}/health`);
  console.log(`   curl "http://localhost:${PORT}/romannumeral?query=42"`);
  console.log(`   curl "http://localhost:${PORT}/romannumeral?query=3999"`);
  console.log(`\n⏹️  Press Ctrl+C to stop the server`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down server...');
  server.close(() => {
    console.log('✅ Server stopped');
    process.exit(0);
  });
}); 