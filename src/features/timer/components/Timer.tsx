import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { ActionButtons } from './ActionButtons';
import { TimerDisplay } from './TimerDisplay';
import { ScrambleDisplay } from './ScrambleDisplay';
import { useTimer } from '../hooks/useTimer';
import { useScramble } from '../hooks/useScramble';
import { useKeyboardControls } from '../hooks/useKeyboardControls';
import { StatsDropdown } from './StatsDropdown';

const Timer: React.FC<{ puzzleType: string }> = ({ puzzleType }) => {
  const dispatch = useAppDispatch();
  const solves = useAppSelector((state) => state.solves.solves);

  const {
    running,
    startTime,
    spacebarHeld,
    justStopped,
    holdStartTime,
    holdDuration,
    getTimerColor,
    getTimerDisplay,
    setJustDeleted,
    setSpacebarHeld,
    setHoldStartTime,
    setJustStopped,
  } = useTimer();

  const {
    currentScramble,
    generateScramble,
    copyAnimation,
    copyScramble,
    generateNewScramble,
  } = useScramble(puzzleType);

  const { togglePlusTwo, toggleDNF, deleteLastSolve, currentSolveId } = useKeyboardControls(
    solves,
    currentScramble,
    puzzleType,
    dispatch,
    generateScramble,
    setJustDeleted,
    running,
    startTime,
    spacebarHeld,
    justStopped,
    holdStartTime,
    holdDuration,
    setSpacebarHeld,
    setHoldStartTime,
    setJustStopped,
  );

  // Get current solve for button styling - only if it's the current solve
  const currentSolve = solves.find(solve => solve.id === currentSolveId);
  const isPlusTwo = currentSolve?.state === '+2';
  const isDNF = currentSolve?.state === 'DNF';

  return (
    <div className='relative w-full h-full overflow-hidden'>
      {/* Main Timer Content - Centered */}
      <div className='flex flex-col items-center justify-center min-h-screen'>
        {/* Scramble */}
        <ScrambleDisplay scramble={currentScramble} />
        {/* Timer */}
        <TimerDisplay display={getTimerDisplay()} color={getTimerColor()} />

        {/* Action Buttons */}
        <ActionButtons
          copyScramble={copyScramble}
          generateNewScramble={generateNewScramble}
          togglePlusTwo={togglePlusTwo}
          toggleDNF={toggleDNF}
          deleteLastSolve={deleteLastSolve}
          copyAnimation={copyAnimation}
          isPlusTwo={isPlusTwo}
          isDNF={isDNF}
        />
      </div>

      {/* Statistics - Bottom Right */}
      <div className='absolute bottom-4 right-4'>
        <StatsDropdown
          puzzleType={puzzleType}
          currentScramble={currentScramble}
        />
      </div>
    </div>
  );
};

export default Timer;
