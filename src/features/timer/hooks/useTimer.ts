// src/features/timer/hooks/useTimer.ts
import { useDispatch } from 'react-redux';
import { createSolve, addSolveLocal } from '../../solves/solvesSlice';
import { useState, useCallback, useEffect, useRef } from 'react';

export const useTimer = (puzzleType: string) => {
  const dispatch = useDispatch();

  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      // Set the start time to now minus the already elapsed time
      startTimeRef.current = Date.now() - time;
      intervalRef.current = setInterval(() => {
        if (startTimeRef.current !== null) {
          setTime(Date.now() - startTimeRef.current);
        }
      }, 10); // update every 10ms
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, time]);

  const startTimer = useCallback(() => {
    setIsRunning(true);
  }, []);

  const stopTimer = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resetTimer = useCallback(() => {
    setTime(0);
    setIsRunning(false);
  }, []);

  const saveSolve = async (
    time: number,
    scramble: string,
    state: 'none' | '+2' | 'DNF' = 'none',
  ) => {
    const solve = {
      time,
      scramble,
      createdAt: Date.now(),
      state,
      puzzleType,
    };

    try {
      // Try to save to backend first
      await dispatch(createSolve(solve) as any).unwrap();
    } catch (error) {
      // Fallback to local storage
      dispatch(addSolveLocal({ ...solve, id: Date.now().toString() }));
    }
  };

  return {
    time,
    isRunning,
    startTimer,
    stopTimer,
    resetTimer,
    saveSolve,
    setTime,
  };
};
