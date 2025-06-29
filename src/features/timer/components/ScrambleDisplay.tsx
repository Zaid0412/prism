import React from 'react';

interface ScrambleDisplayProps {
  scramble: string;
}

export const ScrambleDisplay: React.FC<ScrambleDisplayProps> = ({
  scramble,
}) => {
  return (
    <div className='text-sm text-gray-500 max-w-md text-center'>
      Scramble: {scramble}
    </div>
  );
};
