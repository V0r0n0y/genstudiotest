const request = require('supertest');
const app = require('../index');

describe('API Endpoints', () => {
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

    test('should return 400 for non-numeric input', async () => {
      const invalidInputs = ['abc', 'test', '', '1.5', '12.34'];
      for (const invalidInput of invalidInputs) {
        const response = await request(app)
          .get(`/romannumeral?query=${invalidInput}`)
          .expect(400);
        expect(response.text).toBe('Number must be 1-3999');
      }
    });

    test('should return 400 for numbers below 1', async () => {
      const invalidNumbers = ['0', '-1', '-100'];
      for (const invalidNumber of invalidNumbers) {
        const response = await request(app)
          .get(`/romannumeral?query=${invalidNumber}`)
          .expect(400);
        expect(response.text).toBe('Number must be 1-3999');
      }
    });

    test('should return 400 for numbers above 3999', async () => {
      const invalidNumbers = ['4000', '5000', '10000'];
      for (const invalidNumber of invalidNumbers) {
        const response = await request(app)
          .get(`/romannumeral?query=${invalidNumber}`)
          .expect(400);
        expect(response.text).toBe('Number must be 1-3999');
      }
    });
  });
}); 