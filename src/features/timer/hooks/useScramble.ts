import { useCallback, useEffect, useState } from 'react';
import { Scrambow } from 'scrambow';

export const useScramble = (puzzleType: string) => {
  const [currentScramble, setCurrentScramble] = useState('');
  const [copyAnimation, setCopyAnimation] = useState(false);

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

  // Copy scramble to clipboard
  const copyScramble = async () => {
    try {
      await navigator.clipboard.writeText(currentScramble);
      setCopyAnimation(true);
      setTimeout(() => setCopyAnimation(false), 1000); // Reset after 1 second
    } catch (err) {
      console.error('Failed to copy scramble:', err);
    }
  };

  // Generate new scramble
  const generateNewScramble = () => {
    generateScramble();
  };

  return {
    currentScramble,
    generateScramble,
    copyAnimation,
    copyScramble,
    generateNewScramble,
  };
};
