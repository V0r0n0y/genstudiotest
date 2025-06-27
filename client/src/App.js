import React, { useState, useEffect } from 'react';
import {
  Provider,
  defaultTheme,
  Heading,
  TextField,
  Button,
  Text,
  Flex
} from '@adobe/react-spectrum';
import './App.css';

/**
 * Roman Numeral Converter Application
 * 
 * A React application that converts Arabic numerals to Roman numerals
 * using Adobe React Spectrum components for a modern, accessible UI.
 * 
 * Features:
 * - Input validation for numbers 1-3999
 * - Real-time conversion with API integration
 * - Dark and light mode support
 * - Responsive design
 * - Error handling and loading states
 * - Accessibility features
 */

export default function App() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [colorScheme, setColorScheme] = useState('light');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Detect system color scheme
  useEffect(() => {
    const m = window.matchMedia('(prefers-color-scheme: dark)');
    setColorScheme(m.matches ? 'dark' : 'light');
    m.onchange = e => setColorScheme(e.matches ? 'dark' : 'light');
  }, []);

  /**
   * Validates the input number
   * @param {string} value - The input value to validate
   * @returns {Object} Validation result with isValid and errorMessage
   */
  const validateInput = (value) => {
    if (!value) {
      return { isValid: false, errorMessage: 'Please enter a number' };
    }
    
    const number = parseInt(value, 10);
    
    if (isNaN(number)) {
      return { isValid: false, errorMessage: 'Please enter a valid number' };
    }
    
    if (number < 1 || number > 3999) {
      return { isValid: false, errorMessage: 'Number must be between 1 and 3999' };
    }
    
    return { isValid: true, errorMessage: '' };
  };
  
  /**
   * Converts the input number to Roman numeral via API
   */
  const convert = async () => {
    setResult('');
    const validation = validateInput(input);
    
    if (!validation.isValid) {
      setError(validation.errorMessage);
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/romannumeral?query=${input}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to convert number');
      }
      
      const data = await response.json();
      setResult(data.output);
    } catch (err) {
      setError(err.message || 'An error occurred during conversion');
      console.error('Conversion error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Provider theme={defaultTheme} colorScheme={colorScheme}>
      <div className="app-container">
        <Flex direction="column" alignItems="center" gap="size-300">
          <Heading level={1}>Roman numeral converter</Heading>
          <TextField
            label="Enter a number"
            value={input}
            onChange={setInput}
            type="number"
            min={1}
            max={3999}
          />
          <Button variant="cta" onPress={convert} isDisabled={isLoading}>
            Convert to roman numeral
          </Button>
          {error && <Text UNSAFE_style={{ color: 'red', marginTop: 8 }}>{error}</Text>}
          {result && (
            <div className="result-display" style={{ marginTop: 16 }}>
              Roman numeral: <span>{result}</span>
            </div>
          )}
        </Flex>
      </div>
    </Provider>
  );
} 