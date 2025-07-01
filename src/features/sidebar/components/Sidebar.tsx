import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowIcon } from './ArrowIcon';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  puzzleType: string;
  setPuzzleType: (type: string) => void;
}

// Navigation items configuration
const navigationItems = [
  {
    path: '/',
    label: 'Timer',
    icon: (
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
    ),
  },
  {
    path: '/solves',
    label: 'Solves',
    icon: (
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
    ),
  },
  {
    path: '/algorithms',
    label: 'Algorithms',
    icon: (
      <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' />
      </svg>
    ),
  },
];

// Puzzle type options
const puzzleTypes = [
  { value: '333', label: '3x3' },
  { value: '444', label: '4x4' },
  { value: '555', label: '5x5' },
  { value: '666', label: '6x6' },
  { value: '777', label: '7x7' },
];

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
      {/* Logo and Puzzle Type Selector */}
      <div className='p-4 border-b border-gray-700'>
        <div className='flex items-center justify-between'>
          {/* Logo and Text Container */}
          <div className='flex items-center'>
            {/* Logo (always visible) */}
            <img src='/logo192.png' alt='Prism' className='w-8 h-8 min-w-[2rem] max-w-[2rem]' />
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
          <div className='relative mr-3 px-2 py-1'>
            <select
              value={puzzleType}
              onChange={(e) => setPuzzleType(e.target.value)}
              className={`bg-gray-800 text-white px-3 py-2 pr-8 rounded-lg text-sm border border-gray-700 shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-indigo-400 transition-opacity duration-300 appearance-none ${
                isOpen ? 'opacity-100' : 'opacity-0'
              } ${!isOpen ? 'hidden' : ''}`}
            >
              {puzzleTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {/* Custom arrow icon */}
            <span className={`pointer-events-none pr-2 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 ${isOpen ? 'opacity-100' : 'opacity-0'} ${!isOpen ? 'hidden' : ''}`}>
              <svg className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' d='M19 9l-7 7-7-7' />
              </svg>
            </span>
          </div>
        </div>
      </div>

      {/* Navigation links */}
      <nav className='mt-4'>
        {navigationItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors ${
              location.pathname === item.path ? 'bg-gray-700 text-white' : ''
            }`}
          >
            {item.icon}
            <span
              className={`ml-3 transition-opacity duration-300 ${
                isOpen ? 'opacity-100' : 'opacity-0'
              } ${!isOpen ? 'hidden' : ''}`}
            >
              {item.label}
            </span>
          </Link>
        ))}
      </nav>

      {/* Collapse/Expand control at the bottom */}
      <div className="absolute bottom-0 left-0 w-full flex items-center justify-center pb-4">
        <button
          onClick={toggleSidebar}
          className="flex items-center justify-center w-full text-gray-300 hover:text-white focus:outline-none"
        >
          {isOpen ? (
            <>
              <span className="text-2xl font-bold mr-2">←</span>
              <span className="font-medium">Collapse</span>
            </>
          ) : (
            <span className="text-2xl font-bold">→</span>
          )}
        </button>
      </div>
    </div>
  );
};
