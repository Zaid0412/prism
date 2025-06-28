import React from 'react';

interface ArrowIconProps {
  isOpen: boolean;
}

export const ArrowIcon: React.FC<ArrowIconProps> = ({ isOpen }) => (
  <svg
    className={`w-5 h-5 transition-transform duration-200 ${
      isOpen ? 'rotate-180' : ''
    }`}
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
);
