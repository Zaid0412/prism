import React, { useState, useMemo } from 'react';
import { useAppSelector } from '../../../app/hooks';
import { Solve } from './Solve';

const SolvesList: React.FC = () => {
  const solves = useAppSelector((state) => state.solves.solves);
  const [selectedPuzzleType, setSelectedPuzzleType] = useState<string>('333');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [sortField, setSortField] = useState<'date' | 'time'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Define available puzzle types
  const puzzleTypes = ['333', '444', '555', '666', '777'];

  // Filter and sort solves based on selected filters
  const filteredAndSortedSolves = useMemo(() => {
    // First filter the solves
    const filtered = solves.filter((solve) => {
      const puzzleMatch = solve.puzzleType === selectedPuzzleType;
      const stateMatch =
        selectedState === 'all' || solve.state === selectedState;
      return puzzleMatch && stateMatch;
    });

    // Then sort the filtered solves
    return filtered.sort((a, b) => {
      let comparison = 0;

      if (sortField === 'date') {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortField === 'time') {
        // Handle DNF and +2 penalties for time sorting
        const timeA =
          a.state === 'DNF'
            ? Infinity
            : a.state === '+2'
            ? a.time + 2000
            : a.time;
        const timeB =
          b.state === 'DNF'
            ? Infinity
            : b.state === '+2'
            ? b.time + 2000
            : b.time;
        comparison = timeA - timeB;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [solves, selectedPuzzleType, selectedState, sortField, sortOrder]);

  if (solves.length === 0) {
    return <div className='text-gray-400'>No solves yet.</div>;
  }

  return (
    <div className='w-full max-w-md mt-8'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-2xl font-semibold'>Solves</h2>
        <div className='flex space-x-2'>
          {/* Puzzle Type Filter */}
          <select
            value={selectedPuzzleType}
            onChange={(e) => setSelectedPuzzleType(e.target.value)}
            className='text-xs bg-gray-700 text-white px-2 py-1 rounded border border-gray-600 focus:outline-none focus:border-blue-500'
          >
            {puzzleTypes.map((type: string) => (
              <option key={type} value={type}>
                {type === '333'
                  ? '3x3'
                  : type === '444'
                  ? '4x4'
                  : type === '555'
                  ? '5x5'
                  : type === '666'
                  ? '6x6'
                  : type === '777'
                  ? '7x7'
                  : type}
              </option>
            ))}
          </select>

          {/* State Filter */}
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className='text-xs bg-gray-700 text-white px-2 py-1 rounded border border-gray-600 focus:outline-none focus:border-blue-500'
          >
            <option value='all'>All States</option>
            <option value='none'>Normal</option>
            <option value='+2'>+2</option>
            <option value='DNF'>DNF</option>
          </select>
        </div>
      </div>

      {/* Sort Options */}
      <div className='flex justify-end items-center mb-4'>
        <div className='flex space-x-2'>
          {/* Sort Field */}
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value as 'date' | 'time')}
            className='text-xs bg-gray-700 text-white px-2 py-1 rounded border border-gray-600 focus:outline-none focus:border-blue-500'
          >
            <option value='date'>Date</option>
            <option value='time'>Time</option>
          </select>

          {/* Sort Order */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
            className='text-xs bg-gray-700 text-white px-2 py-1 rounded border border-gray-600 focus:outline-none focus:border-blue-500'
          >
            <option value='desc'>Newest/Desc</option>
            <option value='asc'>Oldest/Asc</option>
          </select>
        </div>
      </div>

      {filteredAndSortedSolves.length === 0 ? (
        <div className='text-gray-400 text-center py-4'>
          No solves match the selected filters.
        </div>
      ) : (
        <ul className='bg-gray-800 rounded shadow divide-y divide-gray-700'>
          {filteredAndSortedSolves.map((solve, idx) => (
            <Solve
              key={solve.id}
              solve={solve}
              index={idx}
              totalSolves={filteredAndSortedSolves.length}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default SolvesList;
