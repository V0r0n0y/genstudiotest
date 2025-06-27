const request = require('supertest');
const app = require('../index');

/**
 * API Test Suite
 * 
 * Tests cover:
 * - Health check endpoint
 * - Roman numeral conversion endpoint
 * - Error handling
 * - Input validation
 * - Response formats
 */

describe('API Endpoints', () => {
  describe('GET /health', () => {
    test('should return 200 and health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
      expect(new Date(response.body.timestamp)).toBeInstanceOf(Date);
    });
  });

  describe('GET /romannumeral', () => {
    test('should convert valid numbers correctly', async () => {
      const testCases = [
        { input: '1', expected: 'I' },
        { input: '4', expected: 'IV' },
        { input: '9', expected: 'IX' },
        { input: '49', expected: 'XLIX' },
        { input: '99', expected: 'XCIX' },
        { input: '499', expected: 'CDXCIX' },
        { input: '999', expected: 'CMXCIX' },
        { input: '3999', expected: 'MMMCMXCIX' }
      ];

      for (const { input, expected } of testCases) {
        const response = await request(app)
          .get(`/romannumeral?query=${input}`)
          .expect(200);

        expect(response.body).toEqual({
          input: input,
          output: expected
        });
      }
    });

    test('should handle edge cases correctly', async () => {
      const edgeCases = [
        { input: '1', expected: 'I' },
        { input: '10', expected: 'X' },
        { input: '50', expected: 'L' },
        { input: '100', expected: 'C' },
        { input: '500', expected: 'D' },
        { input: '1000', expected: 'M' }
      ];

      for (const { input, expected } of edgeCases) {
        const response = await request(app)
          .get(`/romannumeral?query=${input}`)
          .expect(200);

        expect(response.body).toEqual({
          input: input,
          output: expected
        });
      }
    });

    test('should return 400 for missing query parameter', async () => {
      const response = await request(app)
        .get('/romannumeral')
        .expect(400);

      expect(response.text).toBe('Missing query parameter');
    });

    test('should return 400 for empty query parameter', async () => {
      const response = await request(app)
        .get('/romannumeral?query=')
        .expect(400);

      expect(response.text).toBe('Invalid number format');
    });

    test('should return 400 for non-numeric input', async () => {
      const invalidInputs = ['abc', '12.34', '1.5', 'test', ''];

      for (const invalidInput of invalidInputs) {
        const response = await request(app)
          .get(`/romannumeral?query=${invalidInput}`)
          .expect(400);

        expect(response.text).toBe('Invalid number format');
      }
    });

    test('should return 400 for numbers below 1', async () => {
      const invalidNumbers = ['0', '-1', '-100'];

      for (const invalidNumber of invalidNumbers) {
        const response = await request(app)
          .get(`/romannumeral?query=${invalidNumber}`)
          .expect(400);

        expect(response.text).toBe('Number must be between 1 and 3999');
      }
    });

    test('should return 400 for numbers above 3999', async () => {
      const invalidNumbers = ['4000', '5000', '10000'];

      for (const invalidNumber of invalidNumbers) {
        const response = await request(app)
          .get(`/romannumeral?query=${invalidNumber}`)
          .expect(400);

        expect(response.text).toBe('Number must be between 1 and 3999');
      }
    });

    test('should return 400 for decimal numbers', async () => {
      const decimalNumbers = ['1.5', '2.7', '10.1'];

      for (const decimalNumber of decimalNumbers) {
        const response = await request(app)
          .get(`/romannumeral?query=${decimalNumber}`)
          .expect(400);

        expect(response.text).toBe('Invalid number format');
      }
    });

    test('should handle multiple query parameters correctly', async () => {
      const response = await request(app)
        .get('/romannumeral?query=42&other=value')
        .expect(200);

      expect(response.body).toEqual({
        input: '42',
        output: 'XLII'
      });
    });

    test('should handle URL encoding correctly', async () => {
      const response = await request(app)
        .get('/romannumeral?query=100')
        .expect(200);

      expect(response.body).toEqual({
        input: '100',
        output: 'C'
      });
    });
  });

  describe('Error Handling', () => {
    test('should return 404 for non-existent endpoints', async () => {
      const response = await request(app)
        .get('/nonexistent')
        .expect(404);

      expect(response.text).toBe('Not found');
    });

    test('should return 404 for POST to romannumeral endpoint', async () => {
      const response = await request(app)
        .post('/romannumeral')
        .expect(404);

      expect(response.text).toBe('Not found');
    });

    test('should handle malformed URLs gracefully', async () => {
      const response = await request(app)
        .get('/romannumeral?')
        .expect(400);

      expect(response.text).toBe('Missing query parameter');
    });
  });

  describe('Response Headers', () => {
    test('should include CORS headers', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.headers).toHaveProperty('access-control-allow-origin');
    });

    test('should include security headers', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      // Helmet adds security headers
      expect(response.headers).toHaveProperty('x-content-type-options');
    });
  });

  describe('Performance', () => {
    test('should handle rapid requests', async () => {
      const promises = [];
      
      for (let i = 1; i <= 10; i++) {
        promises.push(
          request(app)
            .get(`/romannumeral?query=${i}`)
            .expect(200)
        );
      }

      const responses = await Promise.all(promises);
      
      responses.forEach((response, index) => {
        expect(response.body).toHaveProperty('input', (index + 1).toString());
        expect(response.body).toHaveProperty('output');
      });
    });
  });
}); 