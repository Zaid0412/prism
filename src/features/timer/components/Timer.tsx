import React, { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { start, stop, reset } from '../timerSlice';
import { addSolve } from '../../solves/solvesSlice';
import { Scrambow } from 'scrambow';

const Timer: React.FC<{ puzzleType: string }> = ({ puzzleType }) => {
  const dispatch = useAppDispatch();
  const { running, elapsed, startTime } = useAppSelector(
    (state) => state.timer,
  );
  const [display, setDisplay] = useState(elapsed);
  // const [puzzleType, setPuzzleType] = useState('333'); // Default to 3x3
  const [currentScramble, setCurrentScramble] = useState('');
  const [spacebarHeld, setSpacebarHeld] = useState(false);
  const [justStopped, setJustStopped] = useState(false);
  const [holdStartTime, setHoldStartTime] = useState<number | null>(null);
  const [holdDuration] = useState(500); // 0.5 seconds in milliseconds
  const [holdProgress, setHoldProgress] = useState(0);

  
  // Generate new scramble
const generateScramble = useCallback(() => {
  const scrambow = new Scrambow().setType(puzzleType);
  const scrambles = scrambow.get(1);
  setCurrentScramble(scrambles[0].scramble_string);
}, [puzzleType]);

  // Generate initial scramble
  useEffect(() => {
    generateScramble();
  }, [generateScramble]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (running && startTime) {
      interval = setInterval(() => {
        setDisplay(Date.now() - startTime);
      }, 10);
    } else {
      setDisplay(elapsed);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [running, startTime, elapsed]);

  // Track hold progress
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (spacebarHeld && !running && holdStartTime) {
      interval = setInterval(() => {
        const elapsed = Date.now() - holdStartTime;
        setHoldProgress(Math.min(elapsed / holdDuration, 1));
      }, 10);
    } else {
      setHoldProgress(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [spacebarHeld, running, holdStartTime, holdDuration]);

  // Determine timer color based on hold progress
  const getTimerColor = () => {
    if (running) return 'text-white';
    if (holdProgress >= 1) return 'text-green-400';
    if (holdProgress >= 0.4) return 'text-orange-400'; // 40% of holdDuration
    return 'text-white';
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space' && !spacebarHeld) {
        event.preventDefault();
        setSpacebarHeld(true);
        setHoldStartTime(Date.now());

        if (!running) {
          // Only reset if timer is not running (preparation phase)
          dispatch(reset());
          setJustStopped(false);
        } else {
          // Stop timer when spacebar is pressed (if running)
          dispatch(stop());
          setJustStopped(true);
          dispatch(
            addSolve({
              id: crypto.randomUUID(),
              time: Date.now() - (startTime ?? Date.now()),
              scramble: currentScramble,
              puzzleType: puzzleType,
              date: new Date().toISOString(),
            }),
          );
          // Generate new scramble after solve
          generateScramble();
        }
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code === 'Space' && spacebarHeld) {
        event.preventDefault();
        setSpacebarHeld(false);

        if (!running && !justStopped && holdStartTime) {
          const holdTime = Date.now() - holdStartTime;

          // Only start timer if held for the required duration
          if (holdTime >= holdDuration) {
            dispatch(start());
          }
        }
        setJustStopped(false);
        setHoldStartTime(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [
    running,
    startTime,
    currentScramble,
    puzzleType,
    spacebarHeld,
    justStopped,
    holdStartTime,
    holdDuration,
    dispatch,
  ]);

  return (
    <div className='flex flex-col items-center'>
      <div
        className={`text-6xl font-mono my-8 transition-colors duration-100 ${getTimerColor()}`}
      >
        {(display / 1000).toFixed(2)}
      </div>
      <div className='text-sm text-gray-500 max-w-md text-center'>
        Scramble: {currentScramble}
      </div>
    </div>
  );
};

export default Timer;
