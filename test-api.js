/**
 * Simple API test script
 * Tests the Roman numeral converter API endpoints
 */

const http = require('http');

// Test configuration
const BASE_URL = 'http://localhost:8080';

// Helper function to make HTTP requests
function makeRequest(path, callback) {
  const url = `${BASE_URL}${path}`;
  
  http.get(url, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      callback(null, res.statusCode, data);
    });
  }).on('error', (err) => {
    callback(err);
  });
}

// Test cases
const tests = [
  {
    name: 'Health Check',
    path: '/health',
    expectedStatus: 200,
    description: 'Should return OK status'
  },
  {
    name: 'Convert 1 to Roman',
    path: '/romannumeral?query=1',
    expectedStatus: 200,
    expectedOutput: 'I',
    description: 'Should convert 1 to I'
  },
  {
    name: 'Convert 42 to Roman',
    path: '/romannumeral?query=42',
    expectedStatus: 200,
    expectedOutput: 'XLII',
    description: 'Should convert 42 to XLII'
  },
  {
    name: 'Convert 3999 to Roman',
    path: '/romannumeral?query=3999',
    expectedStatus: 200,
    expectedOutput: 'MMMCMXCIX',
    description: 'Should convert 3999 to MMMCMXCIX'
  },
  {
    name: 'Missing query parameter',
    path: '/romannumeral',
    expectedStatus: 400,
    description: 'Should return 400 for missing query'
  },
  {
    name: 'Invalid number (0)',
    path: '/romannumeral?query=0',
    expectedStatus: 400,
    description: 'Should return 400 for number below 1'
  },
  {
    name: 'Invalid number (4000)',
    path: '/romannumeral?query=4000',
    expectedStatus: 400,
    description: 'Should return 400 for number above 3999'
  },
  {
    name: 'Invalid input (abc)',
    path: '/romannumeral?query=abc',
    expectedStatus: 400,
    description: 'Should return 400 for non-numeric input'
  },
  {
    name: 'Non-existent endpoint',
    path: '/nonexistent',
    expectedStatus: 404,
    description: 'Should return 404 for unknown endpoint'
  }
];

console.log('🧪 Testing Roman Numeral Converter API...\n');

let passed = 0;
let failed = 0;

// Run tests sequentially
async function runTests() {
  for (const test of tests) {
    try {
      await new Promise((resolve) => {
        makeRequest(test.path, (err, statusCode, data) => {
          if (err) {
            console.log(`❌ ${test.name}: Connection error - ${err.message}`);
            failed++;
            resolve();
            return;
          }
          
          let success = statusCode === test.expectedStatus;
          let output = '';
          
          if (test.expectedOutput) {
            try {
              const jsonData = JSON.parse(data);
              success = success && jsonData.output === test.expectedOutput;
              output = ` → ${jsonData.output}`;
            } catch (e) {
              success = false;
              output = ` → Invalid JSON response`;
            }
          }
          
          if (success) {
            console.log(`✅ ${test.name} (${statusCode})${output}`);
            passed++;
          } else {
            console.log(`❌ ${test.name} (${statusCode}, expected ${test.expectedStatus})${output}`);
            console.log(`   Response: ${data}`);
            failed++;
          }
          
          resolve();
        });
      });
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.log(`❌ ${test.name}: Test error - ${error.message}`);
      failed++;
    }
  }
  
  console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);
  
  if (failed === 0) {
    console.log('🎉 All API tests passed! The server is working correctly.');
  } else {
    console.log('⚠️  Some API tests failed. Please check the server implementation.');
  }
}

// Start testing
runTests().catch(console.error); 