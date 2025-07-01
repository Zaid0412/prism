import { useEffect, useState } from "react";

/**
 * Returns the appropriate timer color class based on timer state and hold progress.
 * @param isRunning - Whether the timer is running
 * @param spacebarHeld - Whether the spacebar is currently held
 * @param holdStartTime - The timestamp when the spacebar was pressed
 * @param holdDuration - The required hold duration in ms
 */
export function useTimerColor(
  isRunning: boolean,
  spacebarHeld: boolean,
  holdStartTime: number | null,
  holdDuration: number
) {
  // Force re-render for color update while holding
  const [, setTick] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (spacebarHeld && holdStartTime !== null && !isRunning) {
      interval = setInterval(() => {
        setTick((t) => t + 1);
      }, 16); // ~60fps
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [spacebarHeld, holdStartTime, isRunning]);

  if (isRunning) return "text-white";
  if (spacebarHeld && holdStartTime !== null) {
    const holdProgress = Math.min((Date.now() - holdStartTime) / holdDuration, 1);
    if (holdProgress >= 1) return "text-green-400";
    if (holdProgress >= 0.25) return "text-orange-400";
  }
  return "text-white";
}
