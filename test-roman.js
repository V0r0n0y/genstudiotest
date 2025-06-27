/**
 * Simple test for Roman numeral converter
 * This file tests the core functionality without external dependencies
 */

// Roman numeral conversion function (copied from our utility)
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

// Test cases
const testCases = [
  { input: 1, expected: 'I' },
  { input: 4, expected: 'IV' },
  { input: 9, expected: 'IX' },
  { input: 42, expected: 'XLII' },
  { input: 49, expected: 'XLIX' },
  { input: 99, expected: 'XCIX' },
  { input: 100, expected: 'C' },
  { input: 499, expected: 'CDXCIX' },
  { input: 999, expected: 'CMXCIX' },
  { input: 1000, expected: 'M' },
  { input: 3999, expected: 'MMMCMXCIX' }
];

console.log('🧪 Testing Roman Numeral Converter...\n');

let passed = 0;
let failed = 0;

testCases.forEach(({ input, expected }) => {
  try {
    const result = convertToRoman(input);
    if (result === expected) {
      console.log(`✅ ${input} → ${result} (PASS)`);
      passed++;
    } else {
      console.log(`❌ ${input} → ${result} (FAIL, expected ${expected})`);
      failed++;
    }
  } catch (error) {
    console.log(`❌ ${input} → ERROR: ${error.message}`);
    failed++;
  }
});

console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);

if (failed === 0) {
  console.log('🎉 All tests passed! The Roman numeral converter is working correctly.');
} else {
  console.log('⚠️  Some tests failed. Please check the implementation.');
}

// Test error cases
console.log('\n🧪 Testing error cases...\n');

const errorCases = [
  { input: 0, description: 'Zero' },
  { input: -1, description: 'Negative number' },
  { input: 4000, description: 'Number above 3999' },
  { input: 1.5, description: 'Decimal number' }
];

errorCases.forEach(({ input, description }) => {
  try {
    convertToRoman(input);
    console.log(`❌ ${description} (${input}): Should have thrown error but didn't`);
    failed++;
  } catch (error) {
    console.log(`✅ ${description} (${input}): ${error.message}`);
    passed++;
  }
});

console.log(`\n📊 Final Results: ${passed} passed, ${failed} failed`); 