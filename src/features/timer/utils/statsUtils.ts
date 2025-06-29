export interface Solve {
  id: string;
  time: number; // milliseconds
  scramble: string;
  date: string;
  puzzleType: string;
}

// Calculate average of n solves, excluding best and worst times
export const calculateAoN = (solves: Solve[], n: number): number | null => {
  if (solves.length < n) return null;

  const recentSolves = solves.slice(0, n);
  const times = recentSolves.map((solve) => solve.time).sort((a, b) => a - b);

  // Remove best and worst times
  times.shift(); // Remove best
  times.pop(); // Remove worst

  const average = times.reduce((sum, time) => sum + time, 0) / times.length;
  return average;
};

// Calculate personal best
export const calculatePB = (solves: Solve[]): number | null => {
  if (solves.length === 0) return null;
  return Math.min(...solves.map((solve) => solve.time));
};

// Calculate personal worst
export const calculatePW = (solves: Solve[]): number | null => {
  if (solves.length === 0) return null;
  return Math.max(...solves.map((solve) => solve.time));
};

// Calculate current average
export const calculateCurrentAverage = (solves: Solve[]): number | null => {
  if (solves.length === 0) return null;
  const total = solves.reduce((sum, solve) => sum + solve.time, 0);
  return total / solves.length;
};

// Format time for display
export const formatTime = (time: number | null): string => {
  if (time === null) return '--';
  return (time / 1000).toFixed(2);
};

// Get solves for specific puzzle type
export const getSolvesForPuzzleType = (
  solves: Solve[],
  puzzleType: string,
): Solve[] => {
  return solves.filter((solve) => solve.puzzleType === puzzleType);
};
