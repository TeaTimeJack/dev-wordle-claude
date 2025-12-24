import { LetterState } from './types';
import { VALID_GUESSES } from './words';

/**
 * Check a guess against the answer using two-pass algorithm
 * This correctly handles duplicate letters
 */
export const checkGuess = (guess: string, answer: string): LetterState[] => {
  const result: LetterState[] = Array(5).fill('absent');
  const answerLetters = answer.split('');

  // Pass 1: Mark exact matches (green)
  for (let i = 0; i < 5; i++) {
    if (guess[i] === answer[i]) {
      result[i] = 'correct';
      answerLetters[i] = '';  // Mark as used
    }
  }

  // Pass 2: Mark present letters (yellow)
  for (let i = 0; i < 5; i++) {
    if (result[i] === 'correct') continue;

    const index = answerLetters.indexOf(guess[i]);
    if (index !== -1) {
      result[i] = 'present';
      answerLetters[index] = '';  // Mark as used
    }
  }

  return result;
};

/**
 * Check if a word is valid (exists in word list)
 */
export const isValidWord = (word: string): boolean => {
  return VALID_GUESSES.includes(word.toUpperCase());
};

/**
 * Get keyboard letter states from all guesses
 * Returns a map of letter -> best state (correct > present > absent)
 */
export const getKeyboardStates = (
  guesses: string[],
  answer: string
): Record<string, LetterState> => {
  const states: Record<string, LetterState> = {};

  guesses.forEach((guess) => {
    const results = checkGuess(guess, answer);
    guess.split('').forEach((letter, i) => {
      const currentState = states[letter];
      const newState = results[i];

      // Update only if new state is better (correct > present > absent)
      if (!currentState ||
          (newState === 'correct') ||
          (newState === 'present' && currentState !== 'correct')) {
        states[letter] = newState;
      }
    });
  });

  return states;
};
