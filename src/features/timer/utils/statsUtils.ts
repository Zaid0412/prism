export interface Solve {
  id: string;
  time: number; // milliseconds
  scramble: string;
  date: string;
  puzzleType: string;
  state: 'none' | '+2' | 'DNF';
}

// Calculate average of n solves, excluding best and worst times
export const calculateAoN = (solves: Solve[], n: number): number | null => {
  if (solves.length < n) return null;

  const recentSolves = solves.slice(0, n);
  const validSolves = recentSolves.filter((solve) => solve.state !== 'DNF');

  if (validSolves.length < n) return null;

  const times = validSolves
    .map((solve) => {
      // Add +2 penalty (2 seconds = 2000ms) if state is '+2'
      return solve.state === '+2' ? solve.time + 2000 : solve.time;
    })
    .sort((a, b) => a - b);

  // Remove best and worst times
  times.shift(); // Remove best
  times.pop(); // Remove worst

  const average = times.reduce((sum, time) => sum + time, 0) / times.length;
  return average;
};

// Calculate personal best
export const calculatePB = (solves: Solve[]): number | null => {
  const validSolves = solves.filter((solve) => solve.state !== 'DNF');
  if (validSolves.length === 0) return null;

  const times = validSolves.map((solve) => {
    return solve.state === '+2' ? solve.time + 2000 : solve.time;
  });

  return Math.min(...times);
};

// Calculate personal worst
export const calculatePW = (solves: Solve[]): number | null => {
  const validSolves = solves.filter((solve) => solve.state !== 'DNF');
  if (validSolves.length === 0) return null;

  const times = validSolves.map((solve) => {
    return solve.state === '+2' ? solve.time + 2000 : solve.time;
  });

  return Math.max(...times);
};

// Calculate current average
export const calculateCurrentAverage = (solves: Solve[]): number | null => {
  const validSolves = solves.filter((solve) => solve.state !== 'DNF');
  if (validSolves.length === 0) return null;

  const total = validSolves.reduce((sum, solve) => {
    const time = solve.state === '+2' ? solve.time + 2000 : solve.time;
    return sum + time;
  }, 0);

  return total / validSolves.length;
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

// Get solve count excluding DNFs
export const getValidSolveCount = (solves: Solve[]): number => {
  return solves.filter((solve) => solve.state !== 'DNF').length;
};

// Get DNF count
export const getDNFCount = (solves: Solve[]): number => {
  return solves.filter((solve) => solve.state === 'DNF').length;
};
