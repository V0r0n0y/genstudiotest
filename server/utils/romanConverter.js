/**
 * Roman Numeral Converter Utility
 * 
 * This module implements the conversion of Arabic numerals to Roman numerals
 * following the standard Roman numeral system as defined by historical conventions.
 * 
 * Roman Numeral Rules:
 * - I = 1, V = 5, X = 10, L = 50, C = 100, D = 500, M = 1000
 * - Numerals are written from left to right in descending order
 * - When a smaller numeral appears before a larger one, it is subtracted
 * - Only I, X, C can be used for subtraction (before V, X, L, C, D, M respectively)
 * - The same numeral cannot be repeated more than 3 times in succession
 * - Valid range: 1-3999 (standard Roman numeral system limitation)
 * 
 * @author Your Name
 * @version 1.0.0
 */

/**
 * Converts an Arabic numeral to a Roman numeral
 * 
 * @param {number} number - The Arabic numeral to convert (1-3999)
 * @returns {string} The Roman numeral representation
 * @throws {Error} If the number is outside the valid range
 * 
 * @example
 * convertToRoman(1)    // Returns "I"
 * convertToRoman(4)    // Returns "IV"
 * convertToRoman(9)    // Returns "IX"
 * convertToRoman(49)   // Returns "XLIX"
 * convertToRoman(3999) // Returns "MMMCMXCIX"
 */
function convertToRoman(number) {
  // Validate input range
  if (number < 1 || number > 3999) {
    throw new Error(`Number ${number} is outside the valid range (1-3999)`);
  }
  
  if (!Number.isInteger(number)) {
    throw new Error(`Number ${number} must be an integer`);
  }
  
  // Define the Roman numeral symbols and their values
  // Ordered from largest to smallest for proper conversion
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

/**
 * Validates if a string is a valid Roman numeral
 * 
 * @param {string} romanNumeral - The Roman numeral string to validate
 * @returns {boolean} True if valid, false otherwise
 * 
 * @example
 * isValidRomanNumeral("I")     // Returns true
 * isValidRomanNumeral("IV")    // Returns true
 * isValidRomanNumeral("IIII")  // Returns false (invalid repetition)
 * isValidRomanNumeral("IC")    // Returns false (invalid subtraction)
 */
function isValidRomanNumeral(romanNumeral) {
  if (typeof romanNumeral !== 'string') {
    return false;
  }
  
  // Check for valid characters only
  const validChars = /^[IVXLCDM]+$/;
  if (!validChars.test(romanNumeral)) {
    return false;
  }
  
  // Check for invalid repetitions (more than 3 consecutive same characters)
  const invalidRepetitions = /I{4,}|X{4,}|C{4,}|M{4,}|V{2,}|L{2,}|D{2,}/;
  if (invalidRepetitions.test(romanNumeral)) {
    return false;
  }
  
  // Check for invalid subtraction patterns
  const invalidSubtractions = /IL|IC|ID|IM|XD|XM|VX|VL|VC|VD|VM|LC|LD|LM|DM/;
  if (invalidSubtractions.test(romanNumeral)) {
    return false;
  }
  
  return true;
}

/**
 * Converts a Roman numeral back to an Arabic numeral
 * 
 * @param {string} romanNumeral - The Roman numeral to convert
 * @returns {number} The Arabic numeral representation
 * @throws {Error} If the Roman numeral is invalid
 * 
 * @example
 * convertFromRoman("I")     // Returns 1
 * convertFromRoman("IV")    // Returns 4
 * convertFromRoman("IX")    // Returns 9
 * convertFromRoman("XLIX")  // Returns 49
 */
function convertFromRoman(romanNumeral) {
  if (!isValidRomanNumeral(romanNumeral)) {
    throw new Error(`Invalid Roman numeral: ${romanNumeral}`);
  }
  
  const romanValues = {
    'I': 1,
    'V': 5,
    'X': 10,
    'L': 50,
    'C': 100,
    'D': 500,
    'M': 1000
  };
  
  let result = 0;
  let previousValue = 0;
  
  // Process from right to left
  for (let i = romanNumeral.length - 1; i >= 0; i--) {
    const currentValue = romanValues[romanNumeral[i]];
    
    if (currentValue >= previousValue) {
      result += currentValue;
    } else {
      result -= currentValue;
    }
    
    previousValue = currentValue;
  }
  
  return result;
}

module.exports = {
  convertToRoman,
  convertFromRoman,
  isValidRomanNumeral
}; 