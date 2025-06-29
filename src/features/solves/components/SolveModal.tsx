import React, { useEffect, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';

interface SolveModalProps {
  solve: {
    id: string;
    time: number;
    scramble: string;
    puzzleType: string;
    state: 'none' | '+2' | 'DNF';
    date: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

const formatTime = (ms: number, state: 'none' | '+2' | 'DNF') => {
  if (state === 'DNF') {
    return 'DNF';
  }
  const time = state === '+2' ? ms + 2000 : ms;
  return `${(time / 1000).toFixed(2)}s`;
};

const getStateColor = (state: 'none' | '+2' | 'DNF') => {
  switch (state) {
    case 'DNF':
      return 'text-red-400';
    case '+2':
      return 'text-yellow-400';
    default:
      return 'text-white';
  }
};

const getStateBadge = (state: 'none' | '+2' | 'DNF') => {
  if (state === 'none') return null;

  return (
    <span
      className={`text-sm px-3 py-1 rounded ${
        state === 'DNF'
          ? 'bg-red-900 text-red-300'
          : 'bg-yellow-900 text-yellow-300'
      }`}
    >
      {state}
    </span>
  );
};

const formatPuzzleType = (puzzleType: string) => {
  const puzzleMap: { [key: string]: string } = {
    '222': '2x2',
    '333': '3x3',
    '444': '4x4',
    '555': '5x5',
    '666': '6x6',
    '777': '7x7',
    pyram: 'Pyram',
    skewb: 'Skewb',
    sq1: 'Square-1',
    clock: 'Clock',
    minx: 'Megaminx',
  };
  return puzzleMap[puzzleType] || puzzleType;
};

const getEventId = (puzzleType: string) => {
  const eventMap: { [key: string]: string } = {
    '222': '222',
    '333': '333',
    '444': '444',
    '555': '555',
    '666': '666',
    '777': '777',
    pyram: 'pyram',
    skewb: 'skewb',
    sq1: 'sq1',
    clock: 'clock',
    minx: 'minx',
  };
  return eventMap[puzzleType] || '333';
};

export const SolveModal: React.FC<SolveModalProps> = ({
  solve,
  isOpen,
  onClose,
}) => {
  const scrambleRef = useRef<HTMLDivElement>(null);

  // Update scramble display when modal opens
  useEffect(() => {
    if (isOpen && scrambleRef.current) {
      // Clear previous content
      scrambleRef.current.innerHTML = '';

      // Create scramble-display element
      const scrambleElement = document.createElement('scramble-display');
      scrambleElement.setAttribute('scramble', solve.scramble);
      scrambleElement.setAttribute('event', getEventId(solve.puzzleType));
      scrambleElement.setAttribute('visualization', '2D');
      scrambleElement.style.width = '300px';
      scrambleElement.style.height = '200px';

      scrambleRef.current.appendChild(scrambleElement);
    }
  }, [isOpen, solve.scramble, solve.puzzleType]);

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4'>
        {/* Header */}
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-xl font-semibold text-white'>Solve Details</h2>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-white text-2xl font-bold'
          >
            ×
          </button>
        </div>

        {/* Solve Info */}
        <div className='space-y-4'>
          {/* Time and State */}
          <div className='flex justify-between items-center'>
            <div className='flex items-center space-x-3'>
              <span
                className={`font-mono text-2xl ${getStateColor(solve.state)}`}
              >
                {formatTime(solve.time, solve.state)}
              </span>
              {getStateBadge(solve.state)}
            </div>
            <span className='text-sm text-gray-400'>
              {formatPuzzleType(solve.puzzleType)}
            </span>
          </div>

          {/* Date */}
          <div className='text-sm text-gray-400'>
            {new Date(solve.date).toLocaleString()}
          </div>

          {/* Scramble Visualization */}
          <div className='space-y-2'>
            <div className='flex justify-center'>
              <div ref={scrambleRef} className='p-4 rounded'>
                {/* scramble-display element will be inserted here */}
              </div>
            </div>
          </div>

          {/* Scramble */}
          <div className='space-y-2'>
            <div className='p-3 rounded text-sm font-mono text-gray-200 break-all'>
              {solve.scramble}
            </div>
          </div>

          {/* Actions */}
          <div className='flex space-x-2 pt-4'>
            <button
              onClick={() => {
                navigator.clipboard.writeText(solve.scramble);
              }}
              className='flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm transition-colors'
            >
              Copy Scramble
            </button>
            <button
              onClick={onClose}
              className='flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded text-sm transition-colors'
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
