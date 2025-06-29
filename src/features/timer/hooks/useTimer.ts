import { useEffect, useState } from 'react';
import { useAppSelector } from '../../../app/hooks';
import { start, stop, reset } from '../timerSlice';
import { addSolve } from '../../solves/solvesSlice';
import { useAppDispatch } from '../../../app/hooks';

export const useTimer = () => {
  const dispatch = useAppDispatch();
  const { running, elapsed, startTime } = useAppSelector(
    (state) => state.timer,
  );
  const solves = useAppSelector((state) => state.solves.solves);
  const [display, setDisplay] = useState(elapsed);
  const [spacebarHeld, setSpacebarHeld] = useState(false);
  const [justStopped, setJustStopped] = useState(false);
  const [holdStartTime, setHoldStartTime] = useState<number | null>(null);
  const [holdDuration] = useState(500); // 0.5 seconds in milliseconds
  const [holdProgress, setHoldProgress] = useState(0);
  const [justDeleted, setJustDeleted] = useState(false);

  // Timer display updates
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

  return {
    running,
    elapsed,
    startTime,
    display,
    spacebarHeld,
    justStopped,
    holdStartTime,
    holdProgress,
    holdDuration,
    getTimerColor,
    getTimerDisplay,
    justDeleted,
    setJustDeleted,
    setSpacebarHeld,
    setHoldStartTime,
    setJustStopped,
    dispatch,
    start,
    stop,
    reset,
    addSolve,
  };
};
