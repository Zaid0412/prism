import React, { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { start, stop, reset } from '../timerSlice';
import {
  addSolve,
  updateSolveState,
  deleteSolve,
} from '../../solves/solvesSlice';
import { Scrambow } from 'scrambow';
import { Stats } from './Stats';

const Timer: React.FC<{ puzzleType: string }> = ({ puzzleType }) => {
  const dispatch = useAppDispatch();
  const { running, elapsed, startTime } = useAppSelector(
    (state) => state.timer,
  );
  const solves = useAppSelector((state) => state.solves.solves);
  const [display, setDisplay] = useState(elapsed);
  const [currentScramble, setCurrentScramble] = useState('');
  const [spacebarHeld, setSpacebarHeld] = useState(false);
  const [justStopped, setJustStopped] = useState(false);
  const [holdStartTime, setHoldStartTime] = useState<number | null>(null);
  const [holdDuration] = useState(500); // 0.5 seconds in milliseconds
  const [holdProgress, setHoldProgress] = useState(0);
  const [copyAnimation, setCopyAnimation] = useState(false);
  const [justDeleted, setJustDeleted] = useState(false);

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

  // Get timer display text based on last solve state
  const getTimerDisplay = () => {
    if (running) {
      return (display / 1000).toFixed(2);
    }

    if (justDeleted) {
      return '0.00';
    }

    const lastSolve = solves[0];
    if (!lastSolve) {
      return '0.00';
    }
    if (lastSolve.state === 'DNF') {
      return 'DNF';
    }
    if (lastSolve.state === '+2') {
      return ((lastSolve.time + 2000) / 1000).toFixed(2);
    }
    return (lastSolve.time / 1000).toFixed(2);
  };

  // Action button handlers
  const copyScramble = async () => {
    try {
      await navigator.clipboard.writeText(currentScramble);
      setCopyAnimation(true);
      setTimeout(() => setCopyAnimation(false), 1000); // Reset after 1 second
    } catch (err) {
      console.error('Failed to copy scramble:', err);
    }
  };

  const generateNewScramble = () => {
    generateScramble();
  };

  const togglePlusTwo = () => {
    const lastSolve = solves[0]; // Most recent solve
    if (lastSolve) {
      const newState = lastSolve.state === '+2' ? 'none' : '+2';
      dispatch(updateSolveState({ id: lastSolve.id, state: newState }));
    }
  };

  const toggleDNF = () => {
    const lastSolve = solves[0]; // Most recent solve
    if (lastSolve) {
      const newState = lastSolve.state === 'DNF' ? 'none' : 'DNF';
      dispatch(updateSolveState({ id: lastSolve.id, state: newState }));
    }
  };

const deleteLastSolve = () => {
  const lastSolve = solves[0];
  if (lastSolve) {
    dispatch(deleteSolve(lastSolve.id));
    setJustDeleted(true);
  }
};

  // Get current state of last solve for button styling
  const lastSolve = solves[0];
  const isPlusTwo = lastSolve?.state === '+2';
  const isDNF = lastSolve?.state === 'DNF';

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
              state: 'none', // Default state
              date: new Date().toISOString(),
            }),
          );
          setJustDeleted(false);
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
            setJustDeleted(false);
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
    generateScramble,
  ]);

  return (
    <div className='relative w-full h-full'>
      {/* Main Timer Content - Centered */}
      <div className='flex flex-col items-center justify-center min-h-screen'>
        {/* Timer */}
        <div
          className={`text-6xl font-mono my-8 transition-colors duration-100 ${getTimerColor()}`}
        >
          {getTimerDisplay()}
        </div>

        {/* Action Buttons */}
        <div className='flex flex-wrap gap-2 mb-4 justify-center'>
          <button
            onClick={copyScramble}
            className={`relative hover:bg-gray-700 text-white p-3 rounded transition-all duration-300 ${
              copyAnimation ? 'bg-green-600 scale-110' : ''
            }`}
            title='Copy scramble'
          >
            <svg
              className={`w-5 h-5 transition-all duration-300 ${
                copyAnimation ? 'rotate-12' : ''
              }`}
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z'
              />
            </svg>
            {/* Success checkmark overlay */}
            {copyAnimation && (
              <svg
                className='absolute inset-0 w-5 h-5 m-auto text-white animate-pulse'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={3}
                  d='M5 13l4 4L19 7'
                />
              </svg>
            )}
          </button>

          <button
            onClick={generateNewScramble}
            className='hover:bg-gray-700 text-white p-3 rounded transition-colors'
            title='Generate new scramble'
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
                d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
              />
            </svg>
          </button>

          <button
            onClick={togglePlusTwo}
            className={`p-3 rounded transition-colors ${
              isPlusTwo
                ? 'bg-yellow-600 text-white'
                : 'hover:bg-gray-700 text-white'
            }`}
            title={
              isPlusTwo ? 'Remove +2 penalty' : 'Add +2 penalty to last solve'
            }
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
                d='M12 6v6m0 0v6m0-6h6m-6 0H6'
              />
            </svg>
          </button>

          <button
            onClick={toggleDNF}
            className={`p-3 rounded transition-colors ${
              isDNF ? 'bg-red-600 text-white' : 'hover:bg-gray-700 text-white'
            }`}
            title={isDNF ? 'Remove DNF' : 'Mark last solve as DNF'}
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
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>

          <button
            onClick={deleteLastSolve}
            className='hover:bg-gray-700 text-white p-3 rounded transition-colors'
            title='Delete last solve'
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
                d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
              />
            </svg>
          </button>
        </div>

        {/* Scramble */}
        <div className='text-sm text-gray-500 max-w-md text-center'>
          Scramble: {currentScramble}
        </div>
      </div>

      {/* Statistics - Bottom Right */}
      <div className='absolute bottom-4 right-4'>
        <Stats puzzleType={puzzleType} />
      </div>
    </div>
  );
};

export default Timer;
