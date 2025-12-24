export type LetterState = 'correct' | 'present' | 'absent' | 'empty' | 'current';

export type GameStatus = 'playing' | 'won' | 'lost';

export interface GameState {
  guesses: string[];
  currentGuess: string;
  gameStatus: GameStatus;
  answer: string;
  currentRow: number;
}

export interface TileData {
  letter: string;
  state: LetterState;
}

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: number[]; // [0, 2, 5, 8, 3, 1] = won in 1,2,3,4,5,6 guesses
  lastPlayed: string; // ISO date
}
