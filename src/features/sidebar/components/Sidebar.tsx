import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowIcon } from './ArrowIcon';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  puzzleType: string;
  setPuzzleType: (type: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  toggleSidebar,
  puzzleType,
  setPuzzleType,
}) => {
  const location = useLocation();

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-gray-800 transition-all duration-300 ease-in-out z-50 ${
        isOpen ? 'w-64' : 'w-16'
      }`}
    >
      {/* Toggle button */}
      <button
        onClick={toggleSidebar}
        className='absolute -right-3 top-6 bg-gray-800 text-white p-1 rounded-full border border-gray-600 hover:bg-gray-700 transition-colors'
      >
        <ArrowIcon isOpen={isOpen} />
      </button>

      {/* Logo and Puzzle Type Selector */}
      <div className='p-4 border-b border-gray-700'>
        <div className='flex items-center justify-between'>
          {/* Logo and Text Container */}
          <div className='flex items-center'>
            {/* Logo (always visible) */}
            <img src='/logo192.png' alt='Prism' className='w-8 h-8' />
            {/* Text (only visible when open) */}
            <span
              className={`ml-3 font-bold text-xl tracking-wider transition-opacity duration-300 ${
                isOpen ? 'opacity-100' : 'opacity-0'
              } ${!isOpen ? 'hidden' : ''}`}
            >
              Prism
            </span>
          </div>

          {/* Puzzle Type Selector */}
          <select
            value={puzzleType}
            onChange={(e) => setPuzzleType(e.target.value)}
            className={`bg-gray-700 text-white px-2 py-1 rounded text-sm border border-gray-600 mr-3 transition-opacity duration-300 ${
              isOpen ? 'opacity-100' : 'opacity-0'
            } ${!isOpen ? 'hidden' : ''}`}
          >
            <option value='333'>3x3</option>
            <option value='444'>4x4</option>
            <option value='555'>5x5</option>
            <option value='666'>6x6</option>
            <option value='777'>7x7</option>
          </select>
        </div>
      </div>

      {/* Navigation links */}
      <nav className='mt-4'>
        <Link
          to='/'
          className={`flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors ${
            location.pathname === '/' ? 'bg-gray-700 text-white' : ''
          }`}
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
              d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
          <span
            className={`ml-3 transition-opacity duration-300 ${
              isOpen ? 'opacity-100' : 'opacity-0'
            } ${!isOpen ? 'hidden' : ''}`}
          >
            Timer
          </span>
        </Link>

        <Link
          to='/solves'
          className={`flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors ${
            location.pathname === '/solves' ? 'bg-gray-700 text-white' : ''
          }`}
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
              d='M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
            />
          </svg>
          <span
            className={`ml-3 transition-opacity duration-300 ${
              isOpen ? 'opacity-100' : 'opacity-0'
            } ${!isOpen ? 'hidden' : ''}`}
          >
            Solves
          </span>
        </Link>
      </nav>
    </div>
  );
};
