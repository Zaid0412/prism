import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { ActionButtons } from './ActionButtons';
import { TimerDisplay } from './TimerDisplay';
import { ScrambleDisplay } from './ScrambleDisplay';
import { useTimer } from '../hooks/useTimer';
import { useScramble } from '../hooks/useScramble';
import { useKeyboardControls } from '../hooks/useKeyboardControls';
import { StatsDropdown } from './StatsDropdown';
import { formatTime } from '../utils/statsUtils';
import { useTimerColor } from '../hooks/useTimerColor';
import Header from '../../app/components/Header';

const Timer: React.FC<{ puzzleType: string }> = ({ puzzleType }) => {
  const dispatch = useAppDispatch();
  const solves = useAppSelector((state) => state.solves.solves);

  // Local state for keyboard/timer controls
  const [spacebarHeld, setSpacebarHeld] = React.useState(false);
  const [justStopped, setJustStopped] = React.useState(false);
  const [holdStartTime, setHoldStartTime] = React.useState<number | null>(null);
  const holdDuration = 300; // ms to hold spacebar before timer starts

  const {
    time,
    isRunning,
    startTimer,
    stopTimer,
    resetTimer, 
    setTime,
  } = useTimer(puzzleType);

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
    setJustStopped,
    isRunning,
    time,
    spacebarHeld,
    justStopped,
    holdStartTime,
    holdDuration,
    setSpacebarHeld,
    setHoldStartTime,
    setJustStopped,
    startTimer,
    stopTimer,
    resetTimer,
    setTime,
  );

  const timerColor = useTimerColor(
    isRunning,
    spacebarHeld,
    holdStartTime,
    holdDuration,
  );

  // Get current solve for button styling - only if it's the current solve
  const currentSolve = solves.find(solve => solve.id === currentSolveId) || solves[solves.length - 1];
  const isPlusTwo = currentSolve?.state === '+2';
  const isDNF = currentSolve?.state === 'DNF';

  return (
    <div className='flex flex-col h-screen w-full overflow-hidden'>
      <Header />
      {/* Main Timer Content - Centered */}
      <div className='flex flex-col items-center justify-center flex-1'>
        {/* Scramble */}
        <ScrambleDisplay scramble={currentScramble} />
        {/* Timer */}
        <TimerDisplay display={isDNF ? 'DNF' : formatTime(time)} color={timerColor} />

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
