import React, { useState } from 'react';
import { format } from 'date-fns';
import { formatTime } from '../../solves/components/SolveModal';

interface Solve {
  id: string;
  time: number;
  scramble: string;
  puzzleType: string;
  state: 'none' | '+2' | 'DNF';
  createdAt: number;
}

interface StatsDetailModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  value: number | string;
  solves: Solve[];
  statKey: string;
  puzzleType: string;
  onSolveClick?: (solve: Solve) => void;
  onDeleteSolve?: (solveId: string) => void;
}

export const StatsDetailModal: React.FC<StatsDetailModalProps> = ({
  open,
  onClose,
  title,
  value,
  solves,
  statKey,
  puzzleType,
  onSolveClick,
  onDeleteSolve,
}) => {
  const [reverse, setReverse] = useState(false);
  if (!open) return null;

  const displayedSolves = reverse ? [...solves].reverse() : solves;
  const statDate = solves.length > 0 ? format(new Date(solves[solves.length - 1].createdAt), 'M/d/yyyy') : '';

  // Helper to format puzzle type (e.g., 333 -> 3x3)
  const formatPuzzleType = (type: string) => {
    const map: Record<string, string> = {
      '222': '2x2',
      '333': '3x3',
      '444': '4x4',
      '555': '5x5',
      '666': '6x6',
      '777': '7x7',
      pyram: 'pyram',
      skewb: 'skewb',
      sq1: 'square-1',
      clock: 'clock',
      minx: 'megaminx',
    };
    return map[type] || type;
  };

  // Stat label mapping
  const statLabelMap: Record<string, string> = {
    ao5: 'Average of 5',
    ao12: 'Average of 12',
    pb: 'Personal Best',
    pw: 'Personal Worst',
    currentAvg: 'Current Average',
  };
  let fullTitle = '';
  if (title) {
    fullTitle = `${title}: ${value}`;
  } else {
    const statTitle = statKey && statLabelMap[statKey]
      ? statLabelMap[statKey]
      : '';
    fullTitle = `Current ${formatPuzzleType(puzzleType)} ${statTitle}: ${value}`;
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-gray-900 rounded-lg border border-gray-700 shadow-lg max-w-lg w-full p-6 relative'>
        <button
          className='absolute top-3 right-4 text-2xl text-gray-400 hover:text-white focus:outline-none'
          onClick={onClose}
        >
          ×
        </button>
        <div className='mb-2'>
          <div className='text-2xl font-semibold text-white'>{fullTitle}</div>
        </div>
        <div className='text-gray-400 text-sm mb-2'>{statDate}</div>
        <div className='mb-4'>
          <span className='inline-block bg-gray-700 text-gray-200 px-3 py-1 rounded text-xs font-semibold'>
            {formatPuzzleType(puzzleType)}
          </span>
        </div>
        <div className='flex items-center mb-2'>
          <input
            type='checkbox'
            id='reverse-order'
            checked={reverse}
            onChange={() => setReverse((r) => !r)}
            className='mr-2 accent-indigo-500'
          />
          <label htmlFor='reverse-order' className='text-sm text-gray-400'>
            Reverse order
          </label>
        </div>
        <ul className='divide-y divide-gray-800 max-h-64 overflow-y-auto'>
          {displayedSolves.map((solve, idx) => (
            <li
              key={solve.id}
              className='flex items-center justify-between py-2 rounded transition-colors'
            >
              <span
                className='text-green-400 font-mono text-lg cursor-pointer hover:underline'
                onClick={() => onSolveClick && onSolveClick(solve)}
              >
                {formatTime(solve.time, solve.state)}
              </span>
              <div className='flex items-center gap-2 text-xs'>
                {solve.state === '+2' && (
                  <span className='bg-yellow-900 text-yellow-300 px-2 py-1 rounded font-bold'>
                    +2
                  </span>
                )}
                {solve.state === 'DNF' && (
                  <span className='bg-red-900 text-red-300 px-2 py-1 rounded font-bold'>
                    DNF
                  </span>
                )}
                {/* Placeholder for delete button */}
                <button
                  className='ml-2 mr-3 text-gray-500 hover:text-red-400 text-lg font-bold focus:outline-none'
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onDeleteSolve) onDeleteSolve(solve.id);
                  }}
                >
                  ×
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}; 