import React from 'react';

interface TimerDisplayProps {
  display: string;
  color: string;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  display,
  color,
}) => {
  return (
    <div
      className={`text-6xl font-mono my-8 transition-colors duration-100 ${color}`}
    >
      {display}
    </div>
  );
};
