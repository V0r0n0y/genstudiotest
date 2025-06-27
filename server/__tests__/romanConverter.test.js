const { convertToRoman, convertFromRoman, isValidRomanNumeral } = require('../utils/romanConverter');

/**
 * Test suite for Roman Numeral Converter
 * 
 * Tests cover:
 * - Basic conversions (1-10)
 * - Complex conversions (11-100)
 * - Large numbers (100-3999)
 * - Edge cases and error conditions
 * - Validation functions
 * - Reverse conversion (Roman to Arabic)
 */

describe('Roman Numeral Converter', () => {
  describe('convertToRoman', () => {
    test('should convert basic numbers 1-10', () => {
      const testCases = [
        { input: 1, expected: 'I' },
        { input: 2, expected: 'II' },
        { input: 3, expected: 'III' },
        { input: 4, expected: 'IV' },
        { input: 5, expected: 'V' },
        { input: 6, expected: 'VI' },
        { input: 7, expected: 'VII' },
        { input: 8, expected: 'VIII' },
        { input: 9, expected: 'IX' },
        { input: 10, expected: 'X' }
      ];

      testCases.forEach(({ input, expected }) => {
        expect(convertToRoman(input)).toBe(expected);
      });
    });

    test('should convert numbers 11-50', () => {
      const testCases = [
        { input: 11, expected: 'XI' },
        { input: 15, expected: 'XV' },
        { input: 20, expected: 'XX' },
        { input: 25, expected: 'XXV' },
        { input: 30, expected: 'XXX' },
        { input: 35, expected: 'XXXV' },
        { input: 40, expected: 'XL' },
        { input: 45, expected: 'XLV' },
        { input: 49, expected: 'XLIX' },
        { input: 50, expected: 'L' }
      ];

      testCases.forEach(({ input, expected }) => {
        expect(convertToRoman(input)).toBe(expected);
      });
    });

    test('should convert numbers 51-100', () => {
      const testCases = [
        { input: 51, expected: 'LI' },
        { input: 60, expected: 'LX' },
        { input: 70, expected: 'LXX' },
        { input: 80, expected: 'LXXX' },
        { input: 90, expected: 'XC' },
        { input: 99, expected: 'XCIX' },
        { input: 100, expected: 'C' }
      ];

      testCases.forEach(({ input, expected }) => {
        expect(convertToRoman(input)).toBe(expected);
      });
    });

    test('should convert numbers 101-500', () => {
      const testCases = [
        { input: 101, expected: 'CI' },
        { input: 200, expected: 'CC' },
        { input: 300, expected: 'CCC' },
        { input: 400, expected: 'CD' },
        { input: 450, expected: 'CDL' },
        { input: 499, expected: 'CDXCIX' },
        { input: 500, expected: 'D' }
      ];

      testCases.forEach(({ input, expected }) => {
        expect(convertToRoman(input)).toBe(expected);
      });
    });

    test('should convert numbers 501-1000', () => {
      const testCases = [
        { input: 501, expected: 'DI' },
        { input: 600, expected: 'DC' },
        { input: 700, expected: 'DCC' },
        { input: 800, expected: 'DCCC' },
        { input: 900, expected: 'CM' },
        { input: 999, expected: 'CMXCIX' },
        { input: 1000, expected: 'M' }
      ];

      testCases.forEach(({ input, expected }) => {
        expect(convertToRoman(input)).toBe(expected);
      });
    });

    test('should convert large numbers 1001-3999', () => {
      const testCases = [
        { input: 1001, expected: 'MI' },
        { input: 1500, expected: 'MD' },
        { input: 2000, expected: 'MM' },
        { input: 2500, expected: 'MMD' },
        { input: 3000, expected: 'MMM' },
        { input: 3500, expected: 'MMMD' },
        { input: 3999, expected: 'MMMCMXCIX' }
      ];

      testCases.forEach(({ input, expected }) => {
        expect(convertToRoman(input)).toBe(expected);
      });
    });

    test('should throw error for numbers below 1', () => {
      expect(() => convertToRoman(0)).toThrow('Number 0 is outside the valid range (1-3999)');
      expect(() => convertToRoman(-1)).toThrow('Number -1 is outside the valid range (1-3999)');
      expect(() => convertToRoman(-100)).toThrow('Number -100 is outside the valid range (1-3999)');
    });

    test('should throw error for numbers above 3999', () => {
      expect(() => convertToRoman(4000)).toThrow('Number 4000 is outside the valid range (1-3999)');
      expect(() => convertToRoman(5000)).toThrow('Number 5000 is outside the valid range (1-3999)');
    });

    test('should throw error for non-integer numbers', () => {
      expect(() => convertToRoman(1.5)).toThrow('Number 1.5 must be an integer');
      expect(() => convertToRoman(2.7)).toThrow('Number 2.7 must be an integer');
      expect(() => convertToRoman(10.1)).toThrow('Number 10.1 must be an integer');
    });
  });

  describe('isValidRomanNumeral', () => {
    test('should validate correct Roman numerals', () => {
      const validNumerals = [
        'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X',
        'XI', 'XV', 'XX', 'XL', 'L', 'XC', 'C', 'CD', 'D', 'CM', 'M',
        'MMMCMXCIX' // 3999
      ];

      validNumerals.forEach(numeral => {
        expect(isValidRomanNumeral(numeral)).toBe(true);
      });
    });

    test('should reject invalid characters', () => {
      const invalidNumerals = [
        'A', 'B', 'E', 'F', 'G', 'H', 'J', 'K', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'W', 'Y', 'Z',
        'IA', 'XB', 'LC', 'DM'
      ];

      invalidNumerals.forEach(numeral => {
        expect(isValidRomanNumeral(numeral)).toBe(false);
      });
    });

    test('should reject invalid repetitions', () => {
      const invalidRepetitions = [
        'IIII', 'XXXX', 'CCCC', 'MMMM', // Too many consecutive
        'VV', 'LL', 'DD' // Cannot repeat V, L, D
      ];

      invalidRepetitions.forEach(numeral => {
        expect(isValidRomanNumeral(numeral)).toBe(false);
      });
    });

    test('should reject invalid subtraction patterns', () => {
      const invalidSubtractions = [
        'IL', 'IC', 'ID', 'IM', // I can only subtract from V, X
        'XD', 'XM', // X can only subtract from L, C
        'VX', 'VL', 'VC', 'VD', 'VM', // V cannot be subtracted
        'LC', 'LD', 'LM', // L can only subtract from C
        'DM' // D cannot be subtracted
      ];

      invalidSubtractions.forEach(numeral => {
        expect(isValidRomanNumeral(numeral)).toBe(false);
      });
    });

    test('should reject non-string inputs', () => {
      expect(isValidRomanNumeral(123)).toBe(false);
      expect(isValidRomanNumeral(null)).toBe(false);
      expect(isValidRomanNumeral(undefined)).toBe(false);
      expect(isValidRomanNumeral({})).toBe(false);
      expect(isValidRomanNumeral([])).toBe(false);
    });
  });

  describe('convertFromRoman', () => {
    test('should convert basic Roman numerals to Arabic', () => {
      const testCases = [
        { input: 'I', expected: 1 },
        { input: 'II', expected: 2 },
        { input: 'III', expected: 3 },
        { input: 'IV', expected: 4 },
        { input: 'V', expected: 5 },
        { input: 'VI', expected: 6 },
        { input: 'VII', expected: 7 },
        { input: 'VIII', expected: 8 },
        { input: 'IX', expected: 9 },
        { input: 'X', expected: 10 }
      ];

      testCases.forEach(({ input, expected }) => {
        expect(convertFromRoman(input)).toBe(expected);
      });
    });

    test('should convert complex Roman numerals to Arabic', () => {
      const testCases = [
        { input: 'XLIX', expected: 49 },
        { input: 'LXXXVIII', expected: 88 },
        { input: 'XCIX', expected: 99 },
        { input: 'CDXCIX', expected: 499 },
        { input: 'CMXCIX', expected: 999 },
        { input: 'MMMCMXCIX', expected: 3999 }
      ];

      testCases.forEach(({ input, expected }) => {
        expect(convertFromRoman(input)).toBe(expected);
      });
    });

    test('should throw error for invalid Roman numerals', () => {
      expect(() => convertFromRoman('IIII')).toThrow('Invalid Roman numeral: IIII');
      expect(() => convertFromRoman('IC')).toThrow('Invalid Roman numeral: IC');
      expect(() => convertFromRoman('ABC')).toThrow('Invalid Roman numeral: ABC');
    });

    test('should throw error for empty string', () => {
      expect(() => convertFromRoman('')).toThrow('Invalid Roman numeral: ');
    });
  });

  describe('Round-trip conversion', () => {
    test('should convert Arabic to Roman and back correctly', () => {
      for (let i = 1; i <= 3999; i += 100) {
        const roman = convertToRoman(i);
        const backToArabic = convertFromRoman(roman);
        expect(backToArabic).toBe(i);
      }
    });

    test('should convert Roman to Arabic and back correctly', () => {
      const testNumerals = [
        'I', 'IV', 'IX', 'XLIX', 'XCIX', 'CDXCIX', 'CMXCIX', 'MMMCMXCIX'
      ];

      testNumerals.forEach(numeral => {
        const arabic = convertFromRoman(numeral);
        const backToRoman = convertToRoman(arabic);
        expect(backToRoman).toBe(numeral);
      });
    });
  });
}); 