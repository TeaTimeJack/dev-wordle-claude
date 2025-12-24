import Tile from './Tile';
import { LetterState } from '../lib/types';
import { checkGuess } from '../lib/gameLogic';
import { MAX_GUESSES, WORD_LENGTH } from '../lib/constants';

interface GridProps {
  guesses: string[];
  currentGuess: string;
  answer: string;
  currentRow: number;
  isRevealing?: boolean;
  isInvalid?: boolean;
  isWinning?: boolean;
}

export default function Grid({ guesses, currentGuess, answer, currentRow, isRevealing = false, isInvalid = false, isWinning = false }: GridProps) {
  const getTileState = (rowIndex: number, tileIndex: number): LetterState => {
    // Past guesses - show results
    if (rowIndex < guesses.length) {
      const guess = guesses[rowIndex];
      const results = checkGuess(guess, answer);
      return results[tileIndex];
    }

    // Current row - show current guess
    if (rowIndex === currentRow) {
      if (tileIndex < currentGuess.length) {
        return 'current';
      }
      return 'empty';
    }

    // Future rows - empty
    return 'empty';
  };

  const getTileLetter = (rowIndex: number, tileIndex: number): string => {
    // Past guesses
    if (rowIndex < guesses.length) {
      return guesses[rowIndex][tileIndex] || '';
    }

    // Current guess
    if (rowIndex === currentRow) {
      return currentGuess[tileIndex] || '';
    }

    // Future rows
    return '';
  };

  return (
    <div className="flex flex-col gap-1.5">
      {Array.from({ length: MAX_GUESSES }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-1.5 justify-center">
          {Array.from({ length: WORD_LENGTH }).map((_, tileIndex) => (
            <Tile
              key={tileIndex}
              letter={getTileLetter(rowIndex, tileIndex)}
              state={getTileState(rowIndex, tileIndex)}
              isRevealing={isRevealing && rowIndex === guesses.length - 1}
              isInvalid={isInvalid && rowIndex === currentRow}
              isWinning={isWinning && rowIndex === guesses.length - 1}
              revealDelay={tileIndex * 150}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
