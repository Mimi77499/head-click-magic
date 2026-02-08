import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Delete } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CalculatorProps {
  onClose?: () => void;
  onInsert?: (value: string) => void;
  isOpen?: boolean;
}

export function Calculator({ onClose, onInsert, isOpen = true }: CalculatorProps) {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);

  const handleNumber = (num: string) => {
    if (waitingForNewValue) {
      setDisplay(num);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleDecimal = () => {
    if (waitingForNewValue) {
      setDisplay('0.');
      setWaitingForNewValue(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleOperation = (op: string) => {
    const currentValue = parseFloat(display);

    if (prevValue !== null && operation && !waitingForNewValue) {
      const result = calculate(prevValue, currentValue, operation);
      setDisplay(String(result));
      setPrevValue(result);
    } else {
      setPrevValue(currentValue);
    }

    setOperation(op);
    setWaitingForNewValue(true);
  };

  const calculate = (prev: number, current: number, op: string): number => {
    switch (op) {
      case '+':
        return prev + current;
      case '-':
        return prev - current;
      case '×':
        return prev * current;
      case '÷':
        return prev / current;
      case '%':
        return prev % current;
      default:
        return current;
    }
  };

  const handleEquals = () => {
    if (prevValue !== null && operation) {
      const result = calculate(prevValue, parseFloat(display), operation);
      setDisplay(String(result));
      setPrevValue(null);
      setOperation(null);
      setWaitingForNewValue(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPrevValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
  };

  const handleBackspace = () => {
    if (display.length === 1) {
      setDisplay('0');
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const handleInsert = () => {
    if (onInsert) {
      onInsert(display);
      handleClear();
      onClose?.();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="fixed bottom-6 right-6 z-50 bg-white rounded-3xl border-3 border-orange-200 shadow-2xl p-4 max-w-sm"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">💰 Calculator</h3>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          )}
        </div>

        {/* Display */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-300 rounded-2xl p-4 mb-4">
          <div className="text-right text-4xl font-bold text-gray-900 break-words">
            {display}
          </div>
          {operation && (
            <div className="text-right text-sm text-orange-600 mt-1">
              {prevValue} {operation}
            </div>
          )}
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-4 gap-2">
          {/* Row 1 */}
          <Button
            onClick={handleClear}
            className="col-span-2 bg-red-100 hover:bg-red-200 text-red-700 border-2 border-red-300 font-bold rounded-xl"
          >
            Clear
          </Button>
          <Button
            onClick={handleBackspace}
            className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 border-2 border-yellow-300 font-bold rounded-xl"
          >
            <Delete className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => handleOperation('÷')}
            className={`font-bold text-lg rounded-xl border-2 ${
              operation === '÷'
                ? 'bg-orange-500 text-white border-orange-600'
                : 'bg-orange-100 hover:bg-orange-200 text-orange-700 border-orange-300'
            }`}
          >
            ÷
          </Button>

          {/* Row 2 */}
          {[7, 8, 9].map((num) => (
            <Button
              key={num}
              onClick={() => handleNumber(String(num))}
              className="bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-300 font-bold text-lg rounded-xl"
            >
              {num}
            </Button>
          ))}
          <Button
            onClick={() => handleOperation('×')}
            className={`font-bold text-lg rounded-xl border-2 ${
              operation === '×'
                ? 'bg-orange-500 text-white border-orange-600'
                : 'bg-orange-100 hover:bg-orange-200 text-orange-700 border-orange-300'
            }`}
          >
            ×
          </Button>

          {/* Row 3 */}
          {[4, 5, 6].map((num) => (
            <Button
              key={num}
              onClick={() => handleNumber(String(num))}
              className="bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-300 font-bold text-lg rounded-xl"
            >
              {num}
            </Button>
          ))}
          <Button
            onClick={() => handleOperation('-')}
            className={`font-bold text-lg rounded-xl border-2 ${
              operation === '-'
                ? 'bg-orange-500 text-white border-orange-600'
                : 'bg-orange-100 hover:bg-orange-200 text-orange-700 border-orange-300'
            }`}
          >
            −
          </Button>

          {/* Row 4 */}
          {[1, 2, 3].map((num) => (
            <Button
              key={num}
              onClick={() => handleNumber(String(num))}
              className="bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-300 font-bold text-lg rounded-xl"
            >
              {num}
            </Button>
          ))}
          <Button
            onClick={() => handleOperation('+')}
            className={`font-bold text-lg rounded-xl border-2 ${
              operation === '+'
                ? 'bg-orange-500 text-white border-orange-600'
                : 'bg-orange-100 hover:bg-orange-200 text-orange-700 border-orange-300'
            }`}
          >
            +
          </Button>

          {/* Row 5 */}
          <Button
            onClick={() => handleNumber('0')}
            className="col-span-2 bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-300 font-bold text-lg rounded-xl"
          >
            0
          </Button>
          <Button
            onClick={handleDecimal}
            className="bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-300 font-bold text-lg rounded-xl"
          >
            .
          </Button>
          <Button
            onClick={handleEquals}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:shadow-lg text-white border-2 border-orange-600 font-bold text-lg rounded-xl"
          >
            =
          </Button>
        </div>

        {/* Insert Button (if callback provided) */}
        {onInsert && (
          <Button
            onClick={handleInsert}
            className="w-full mt-4 bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold rounded-xl hover:shadow-lg"
          >
            ✓ Use This Number
          </Button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
