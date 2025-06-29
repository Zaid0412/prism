import React, { useState, useEffect, useRef } from 'react';
import { Stats } from './Stats';

interface StatsDropdownProps {
  puzzleType: string;
  currentScramble: string;
}

export const StatsDropdown: React.FC<StatsDropdownProps> = ({
  puzzleType,
  currentScramble,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [displayMode, setDisplayMode] = useState<'stats' | 'scramble'>('stats');
  const scrambleRef = useRef<HTMLDivElement>(null);

  // Map puzzleType to event ID for scramble-display
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

  // Update scramble display when scramble changes
  useEffect(() => {
    if (displayMode === 'scramble' && scrambleRef.current) {
      // Clear previous content
      scrambleRef.current.innerHTML = '';

      // Create scramble-display element
      const scrambleElement = document.createElement('scramble-display');
      scrambleElement.setAttribute('scramble', currentScramble);
      scrambleElement.setAttribute('event', getEventId(puzzleType));
      scrambleElement.setAttribute('visualization', '2D');
      scrambleElement.style.width = '350px';
      scrambleElement.style.height = '250px';

      scrambleRef.current.appendChild(scrambleElement);
    }
  }, [currentScramble, puzzleType, displayMode]);

  return (
    <div className='bg-gray-800 border border-gray-600 rounded-lg p-4 min-w-[200px] relative'>
      {/* Dropdown Menu - Inside the content area */}
      <div className='absolute top-2 right-2'>
        <div
          className='relative'
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Dropdown Trigger Button */}
          <button className='text-gray-400 hover:text-white p-1 rounded'>
            <svg
              className='w-4 h-4'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M19 9l-7 7-7-7'
              />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isHovered && (
            <div className='absolute top-full right-0 mt-1 bg-gray-700 border border-gray-600 rounded-lg shadow-lg z-10 min-w-[100px]'>
              <div className='p-1'>
                <button
                  onClick={() => setDisplayMode('stats')}
                  className={`block w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                    displayMode === 'stats'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Stats
                </button>
                <button
                  onClick={() => setDisplayMode('scramble')}
                  className={`block w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                    displayMode === 'scramble'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Scramble
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content Display */}
      {displayMode === 'stats' ? (
        <div className='pt-6'>
          <Stats puzzleType={puzzleType} />
        </div>
      ) : (
        <div className='text-center w-96 h-64 pt-6'>
          <div
            ref={scrambleRef}
            className='flex justify-center align-center pb-12'
          >
            {/* scramble-display element will be inserted here */}
          </div>
        </div>
      )}
    </div>
  );
};
