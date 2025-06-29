import React from 'react';
import { useAppSelector } from '../../../app/hooks';
import {
  calculateAoN,
  calculatePB,
  calculatePW,
  calculateCurrentAverage,
  formatTime,
  getSolvesForPuzzleType,
} from '../utils/statsUtils';

interface StatsProps {
  puzzleType: string;
}

export const Stats: React.FC<StatsProps> = ({ puzzleType }) => {
  const solves = useAppSelector((state) => state.solves.solves);
  const puzzleSolves = getSolvesForPuzzleType(solves, puzzleType);

  const ao5 = calculateAoN(puzzleSolves, 5);
  const ao12 = calculateAoN(puzzleSolves, 12);
  const pb = calculatePB(puzzleSolves);
  const pw = calculatePW(puzzleSolves);
  const currentAvg = calculateCurrentAverage(puzzleSolves);

  return (
    <div className='bg-gray-800 rounded-lg p-4 pt-8 w-96 h-86'>
      <div className='grid grid-cols-2 gap-4'>
        <div className='text-center'>
          <div className='text-sm text-gray-400'>PB</div>
          <div className='text-xl font-mono'>{formatTime(pb)}</div>
        </div>
        <div className='text-center'>
          <div className='text-sm text-gray-400'>PW</div>
          <div className='text-xl font-mono'>{formatTime(pw)}</div>
        </div>
        <div className='text-center'>
          <div className='text-sm text-gray-400'>Ao5</div>
          <div className='text-xl font-mono'>{formatTime(ao5)}</div>
        </div>
        <div className='text-center'>
          <div className='text-sm text-gray-400'>Ao12</div>
          <div className='text-xl font-mono'>{formatTime(ao12)}</div>
        </div>
        <div className='text-center col-span-2'>
          <div className='text-sm text-gray-400'>Current Average</div>
          <div className='text-xl font-mono'>{formatTime(currentAvg)}</div>
        </div>
      </div>
      <div className='text-center mt-3 text-sm text-gray-500'>
        {puzzleSolves.length} solves
      </div>
    </div>
  );
};
