import { useEffect } from 'react';
import { AppDispatch } from '../../../app/store';
import { updateSolveState, deleteSolve } from '../../solves/solvesSlice';
import { addSolve } from '../../solves/solvesSlice';
import { start, stop, reset } from '../timerSlice';

interface Solve {
  id: string;
  time: number;
  scramble: string;
  puzzleType: string;
  state: 'none' | '+2' | 'DNF';
  date: string;
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
) => {
  // Action button handlers
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

  // Keyboard event handlers
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
    setSpacebarHeld,
    setHoldStartTime,
    setJustStopped,
    setJustDeleted,
  ]);

  return {
    togglePlusTwo,
    toggleDNF,
    deleteLastSolve,
  };
};
