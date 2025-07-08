import { useEffect, useState } from 'react';
import { AppDispatch } from '../../../app/store';
import { updateSolve, deleteSolve } from '../../solves/solvesSlice';
import { createSolve } from '../../solves/solvesSlice';
import { useUser } from '@clerk/clerk-react';
import { addSolveLocal } from '../../solves/solvesSlice';

interface Solve {
  id: string;
  time: number;
  scramble: string;
  puzzleType: string;
  state: 'none' | '+2' | 'DNF';
  timestamp: number;
}

export const useKeyboardControls = (
  solves: Solve[],
  currentScramble: string,
  puzzleType: string,
  dispatch: AppDispatch,
  generateScramble: () => void,
  setJustDeleted: (value: boolean) => void,
  running: boolean,
  startTime: number | null,
  spacebarHeld: boolean,
  justStopped: boolean,
  holdStartTime: number | null,
  holdDuration: number,
  setSpacebarHeld: (value: boolean) => void,
  setHoldStartTime: (value: number | null) => void,
  setJustStopped: (value: boolean) => void,
  startTimer: () => void,
  stopTimer: () => void,
  resetTimer: () => void,
  setTime: (value: number) => void,
) => {
  // Track the current solve ID that can be edited
  const [currentSolveId, setCurrentSolveId] = useState<string | null>(null);
  const { isSignedIn } = useUser();

  // Action button handlers - only work on the current solve
  const togglePlusTwo = () => {
    let currentSolve = solves.find((solve) => solve.id === currentSolveId);
    if (!currentSolve && solves.length > 0) {
      currentSolve = solves[solves.length - 1];
    }
    if (currentSolve) {
      const newState = currentSolve.state === '+2' ? 'none' : '+2';
      dispatch(updateSolve({ id: currentSolve.id, solve: { state: newState } }));
      if (currentSolve === solves[solves.length - 1]) {
        resetTimer();
        const newTime = newState === '+2' ? currentSolve.time + 2000 : currentSolve.time;
        setTimeout(() => {
          if (typeof setTime === 'function') setTime(newTime);
        }, 0);
      }
    }
  };

  const toggleDNF = () => {
    let currentSolve = solves.find((solve) => solve.id === currentSolveId);
    if (!currentSolve && solves.length > 0) {
      currentSolve = solves[solves.length - 1];
    }
    if (currentSolve) {
      const newState = currentSolve.state === 'DNF' ? 'none' : 'DNF';
      dispatch(updateSolve({ id: currentSolve.id, solve: { state: newState } }));
      if (currentSolve === solves[solves.length - 1]) {
        resetTimer();
        const newTime = newState === 'DNF' ? 0 : currentSolve.time;
        setTimeout(() => {
          if (typeof setTime === 'function') setTime(newTime);
        }, 0);
      }
    }
  };

  const deleteLastSolve = () => {
    let currentSolve = solves.find((solve) => solve.id === currentSolveId);
    if (!currentSolve && solves.length > 0) {
      currentSolve = solves[solves.length - 1];
    }
    if (currentSolve) {
      dispatch(deleteSolve(currentSolve.id));
      setCurrentSolveId(null); // Clear current solve ID after deletion
      setJustDeleted(true);
      resetTimer(); // Reset the timer display to 0.00
    }
  };

  // Keyboard event handlers
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space' && !spacebarHeld) {
        event.preventDefault();
        setSpacebarHeld(true);
        setHoldStartTime(Date.now());

        if (!running) {
          // Only reset if timer is not running (preparation phase)
          resetTimer();
          setJustStopped(false);
        } else {
          // Stop timer when spacebar is pressed (if running)
          stopTimer();
          setJustStopped(true);
          const newSolveId = crypto.randomUUID();
          const solveData = {
            time: startTime ?? 0,
            scramble: currentScramble,
            puzzleType: puzzleType,
            state: "none" as "none",
            timestamp: Date.now(),
            id: newSolveId,
          };
          if (isSignedIn) {
            dispatch(createSolve(solveData));
          } else {
            dispatch(addSolveLocal(solveData));
          }
          setCurrentSolveId(newSolveId); // Set this as the current solve
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
            startTimer();
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
    setSpacebarHeld,
    setHoldStartTime,
    setJustStopped,
    setJustDeleted,
    startTimer,
    stopTimer,
    resetTimer,
    setTime,
    isSignedIn,
  ]);

  return {
    togglePlusTwo,
    toggleDNF,
    deleteLastSolve,
    currentSolveId,
  };
};
