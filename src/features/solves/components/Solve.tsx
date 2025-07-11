import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { SolveModal } from './SolveModal';
import { useAppDispatch } from '../../../app/hooks';
import { deleteSolve, updateSolve, updateSolveLocal } from '../solvesSlice';
import { useUser } from '@clerk/clerk-react';
import { deleteSolveLocal } from '../../solves/solvesSlice';

interface SolveProps {
  solve: {
    id: string;
    time: number;
    scramble: string;
    puzzleType: string;
    state: 'none' | '+2' | 'DNF';
    createdAt: number;
  };
  index: number;
  totalSolves: number;
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
      className={`text-xs px-2 py-1 rounded ${
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

export const Solve: React.FC<SolveProps> = ({ solve, index, totalSolves }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { isSignedIn } = useUser();

  const handleClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (isSignedIn) {
      dispatch(deleteSolve(solve.id));
    } else {
      dispatch(deleteSolveLocal(solve.id));
    }
    setIsModalOpen(false);
  };

  const handleEdit = () => {
    // Placeholder: open an edit modal or implement edit logic
    alert('Edit functionality coming soon!');
  };

  const handlePlus2 = () => {
    const newState = solve.state === '+2' ? 'none' : '+2';
    dispatch(updateSolveLocal({ id: solve.id, solve: { state: newState } }));
    dispatch(updateSolve({ id: solve.id, solve: { state: newState } }));
  };

  const handleDNF = () => {
    const newState = solve.state === 'DNF' ? 'none' : 'DNF';
    dispatch(updateSolveLocal({ id: solve.id, solve: { state: newState } }));
    dispatch(updateSolve({ id: solve.id, solve: { state: newState } }));
  };

  return (
    <>
      <li
        className='flex justify-between items-center px-4 py-3 hover:bg-gray-750 transition-colors cursor-pointer'
        onClick={handleClick}
      >
        <div className='flex items-center space-x-2'>
          <span className='text-gray-400'>#{totalSolves - index}</span>
          <span className='text-xs bg-gray-700 px-2 py-1 rounded'>
            {formatPuzzleType(solve.puzzleType)}
          </span>
          {getStateBadge(solve.state)}
        </div>

        <div className='flex flex-col items-end'>
          <span className={`font-mono text-lg ${getStateColor(solve.state)}`}>
            {formatTime(solve.time, solve.state)}
          </span>
          <span className='text-xs text-gray-400'>
            {formatDistanceToNow(new Date(solve.createdAt ?? Date.now()))}
          </span>
        </div>
      </li>

      <SolveModal
        solve={{ ...solve }}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onPlus2={handlePlus2}
        onDNF={handleDNF}
      />
    </>
  );
};
