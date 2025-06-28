import React from 'react';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { clearSolves } from '../solvesSlice';

const formatTime = (ms: number) => (ms / 1000).toFixed(2);

const SolvesList: React.FC = () => {
  const solves = useAppSelector((state) => state.solves.solves);
  const dispatch = useAppDispatch();

  if (solves.length === 0) {
    return <div className='text-gray-400'>No solves yet.</div>;
  }

  return (
    <div className='w-full max-w-md mt-8'>
      <div className='flex justify-between items-center mb-2'>
        <h2 className='text-2xl font-semibold'>Solves</h2>
        <button
          className='text-sm text-red-400 hover:underline'
          onClick={() => dispatch(clearSolves())}
        >
          Clear All
        </button>
      </div>
      <ul className='bg-gray-800 rounded shadow divide-y divide-gray-700'>
        {solves.map((solve, idx) => (
          <li
            key={solve.id}
            className='flex justify-between items-center px-4 py-2'
          >
            <div className='flex items-center space-x-2'>
              <span>#{solves.length - idx}</span>
              <span className='text-xs bg-gray-700 px-2 py-1 rounded'>
                {solve.puzzleType}
              </span>
            </div>
            <span className='font-mono'>{formatTime(solve.time)}s</span>
            <span className='text-xs text-gray-400'>
              {new Date(solve.date).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SolvesList;
