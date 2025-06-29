import React from 'react';

interface ActionButtonsProps {
  copyScramble: () => void;
  generateNewScramble: () => void;
  togglePlusTwo: () => void;
  toggleDNF: () => void;
  deleteLastSolve: () => void;
  copyAnimation: boolean;
  isPlusTwo: boolean;
  isDNF: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  copyScramble,
  generateNewScramble,
  togglePlusTwo,
  toggleDNF,
  deleteLastSolve,
  copyAnimation,
  isPlusTwo,
  isDNF,
}) => {
  return (
    <div className='flex flex-wrap gap-2 mb-4 justify-center'>
      <button
        onClick={copyScramble}
        className={`relative hover:bg-gray-700 text-white p-3 rounded transition-all duration-300 ${
          copyAnimation ? 'bg-green-600 scale-110' : ''
        }`}
        title='Copy scramble'
      >
        <svg
          className={`w-5 h-5 transition-all duration-300 ${
            copyAnimation ? 'rotate-12' : ''
          }`}
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z'
          />
        </svg>
        {/* Success checkmark overlay */}
        {copyAnimation && (
          <svg
            className='absolute inset-0 w-5 h-5 m-auto text-white animate-pulse'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={3}
              d='M5 13l4 4L19 7'
            />
          </svg>
        )}
      </button>

      <button
        onClick={generateNewScramble}
        className='hover:bg-gray-700 text-white p-3 rounded transition-colors'
        title='Generate new scramble'
      >
        <svg
          className='w-5 h-5'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
          />
        </svg>
      </button>

      <button
        onClick={togglePlusTwo}
        className={`p-3 rounded transition-colors ${
          isPlusTwo
            ? 'bg-yellow-600 text-white'
            : 'hover:bg-gray-700 text-white'
        }`}
        title={
          isPlusTwo ? 'Remove +2 penalty' : 'Add +2 penalty to last solve'
        }
      >
        <svg
          className='w-5 h-5'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M12 6v6m0 0v6m0-6h6m-6 0H6'
          />
        </svg>
      </button>

      <button
        onClick={toggleDNF}
        className={`p-3 rounded transition-colors ${
          isDNF ? 'bg-red-600 text-white' : 'hover:bg-gray-700 text-white'
        }`}
        title={isDNF ? 'Remove DNF' : 'Mark last solve as DNF'}
      >
        <svg
          className='w-5 h-5'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M6 18L18 6M6 6l12 12'
          />
        </svg>
      </button>

      <button
        onClick={deleteLastSolve}
        className='hover:bg-gray-700 text-white p-3 rounded transition-colors'
        title='Delete last solve'
      >
        <svg
          className='w-5 h-5'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
          />
        </svg>
      </button>
    </div>
  );
};