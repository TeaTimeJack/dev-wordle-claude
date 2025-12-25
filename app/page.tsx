'use client';

import { useReducer, useEffect, useState } from 'react';
import Grid from './components/Grid';
import Keyboard from './components/Keyboard';
import StatsModal from './components/StatsModal';
import HelpModal from './components/HelpModal';
import WordListModal from './components/WordListModal';
import { GameState, GameStatus, GameStats } from './lib/types';
import { getRandomWord, getDailyWord, getDaysSinceEpoch } from './lib/words';
import { isValidWord, getKeyboardStates } from './lib/gameLogic';
import { WORD_LENGTH, MAX_GUESSES } from './lib/constants';
import { loadStats, updateStats } from './lib/stats';

type GameMode = 'daily' | 'practice';

type GameAction =
  | { type: 'ADD_LETTER'; letter: string }
  | { type: 'REMOVE_LETTER' }
  | { type: 'SUBMIT_GUESS' }
  | { type: 'SET_GAME_STATUS'; status: GameStatus }
  | { type: 'NEW_GAME'; answer?: string };

const initialState: GameState = {
  guesses: [],
  currentGuess: '',
  gameStatus: 'playing',
  answer: getRandomWord(),
  currentRow: 0,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'ADD_LETTER':
      if (state.currentGuess.length < WORD_LENGTH && state.gameStatus === 'playing') {
        return {
          ...state,
          currentGuess: state.currentGuess + action.letter,
        };
      }
      return state;

    case 'REMOVE_LETTER':
      if (state.currentGuess.length > 0 && state.gameStatus === 'playing') {
        return {
          ...state,
          currentGuess: state.currentGuess.slice(0, -1),
        };
      }
      return state;

    case 'SUBMIT_GUESS':
      if (state.currentGuess.length === WORD_LENGTH && state.gameStatus === 'playing') {
        const newGuesses = [...state.guesses, state.currentGuess];
        const won = state.currentGuess === state.answer;
        const lost = newGuesses.length === MAX_GUESSES && !won;

        return {
          ...state,
          guesses: newGuesses,
          currentGuess: '',
          currentRow: state.currentRow + 1,
          gameStatus: won ? 'won' : lost ? 'lost' : 'playing',
        };
      }
      return state;

    case 'SET_GAME_STATUS':
      return {
        ...state,
        gameStatus: action.status,
      };

    case 'NEW_GAME':
      return {
        guesses: [],
        currentGuess: '',
        gameStatus: 'playing',
        answer: action.answer || getRandomWord(),
        currentRow: 0,
      };

    default:
      return state;
  }
}

export default function Home() {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const [errorMessage, setErrorMessage] = useState('');
  const [isRevealing, setIsRevealing] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  const [isWinning, setIsWinning] = useState(false);
  const [stats, setStats] = useState<GameStats | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showWordList, setShowWordList] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode>('daily');

  // Load stats on mount and initialize daily game
  useEffect(() => {
    setStats(loadStats());
    // Initialize with daily word if in daily mode
    const initialAnswer = gameMode === 'daily' ? getDailyWord() : getRandomWord();
    dispatch({ type: 'NEW_GAME', answer: initialAnswer });

    // Show help on first visit
    const hasSeenHelp = localStorage.getItem('devWordle_hasSeenHelp');
    if (!hasSeenHelp) {
      setShowHelp(true);
      localStorage.setItem('devWordle_hasSeenHelp', 'true');
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Check if daily challenge has been played today
  const isDailyPlayed = () => {
    if (typeof window === 'undefined') return false;
    const today = getDaysSinceEpoch();
    const lastDaily = localStorage.getItem('devWordle_lastDaily');
    return lastDaily === String(today);
  };

  // Mark daily challenge as played
  const markDailyPlayed = () => {
    if (typeof window === 'undefined') return;
    const today = getDaysSinceEpoch();
    localStorage.setItem('devWordle_lastDaily', String(today));
  };

  // Update stats when game ends
  useEffect(() => {
    if (state.gameStatus !== 'playing' && stats) {
      const won = state.gameStatus === 'won';
      const guessCount = state.guesses.length;
      const newStats = updateStats(stats, won, guessCount);
      setStats(newStats);

      // Mark daily as played if in daily mode
      if (gameMode === 'daily') {
        markDailyPlayed();
      }

      // Show stats modal after a delay (after animations)
      setTimeout(() => setShowStats(true), 2000);
    }
  }, [state.gameStatus]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleKeyPress = (key: string) => {
    if (state.gameStatus !== 'playing' || isRevealing) return;

    if (key === 'ENTER') {
      // Validate word before submitting
      if (state.currentGuess.length !== WORD_LENGTH) {
        setErrorMessage('Not enough letters');
        setIsInvalid(true);
        setTimeout(() => {
          setErrorMessage('');
          setIsInvalid(false);
        }, 600);
        return;
      }

      if (!isValidWord(state.currentGuess)) {
        setErrorMessage('Not in word list');
        setIsInvalid(true);
        setTimeout(() => {
          setErrorMessage('');
          setIsInvalid(false);
        }, 600);
        return;
      }

      // Trigger reveal animation
      setIsRevealing(true);
      setTimeout(() => {
        dispatch({ type: 'SUBMIT_GUESS' });
        setIsRevealing(false);

        // Check if won and trigger win animation
        if (state.currentGuess === state.answer) {
          setIsWinning(true);
          setTimeout(() => setIsWinning(false), 1000);
        }
      }, 1500); // Wait for all tiles to flip (5 tiles * 150ms delay + 500ms animation)
    } else if (key === '⌫' || key === 'BACKSPACE') {
      dispatch({ type: 'REMOVE_LETTER' });
    } else if (/^[A-Z]$/.test(key)) {
      dispatch({ type: 'ADD_LETTER', letter: key });
    }
  };

  // Physical keyboard handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      if (e.key === 'Enter') {
        handleKeyPress('ENTER');
      } else if (e.key === 'Backspace') {
        handleKeyPress('⌫');
      } else if (/^[a-z]$/i.test(e.key)) {
        handleKeyPress(e.key.toUpperCase());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.currentGuess, state.gameStatus]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleNewGame = () => {
    // Prevent new daily game if already played today
    if (gameMode === 'daily' && isDailyPlayed()) {
      setErrorMessage('Come back tomorrow for a new daily challenge!');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    const newAnswer = gameMode === 'daily' ? getDailyWord() : getRandomWord();
    dispatch({ type: 'NEW_GAME', answer: newAnswer });
    setErrorMessage('');
  };

  const handleModeChange = (mode: GameMode) => {
    setGameMode(mode);
    // Start new game with correct word for the mode
    const newAnswer = mode === 'daily' ? getDailyWord() : getRandomWord();
    dispatch({ type: 'NEW_GAME', answer: newAnswer });
    setErrorMessage('');
  };

  const keyboardStates = getKeyboardStates(state.guesses, state.answer);

  return (
    <div className="min-h-screen bg-[#1e1e1e] text-[#d4d4d4] flex flex-col items-center justify-between py-8 px-4 font-mono">
      {/* Header */}
      <div className="w-full max-w-lg relative px-2">
        <div className="absolute left-2 top-0 flex gap-1 sm:gap-2">
          <button
            onClick={() => setShowHelp(true)}
            className="text-xl sm:text-2xl text-[#007acc] hover:text-[#1a8ccc] transition-colors p-1"
            title="How to Play"
          >
            ❓
          </button>
          <button
            onClick={() => setShowWordList(true)}
            className="text-xl sm:text-2xl text-[#007acc] hover:text-[#1a8ccc] transition-colors p-1"
            title="View Word List"
          >
            📝
          </button>
        </div>
        <button
          onClick={() => setShowStats(true)}
          className="absolute right-2 top-0 text-xl sm:text-2xl text-[#007acc] hover:text-[#1a8ccc] transition-colors p-1"
          title="View Statistics"
        >
          📊
        </button>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-2 text-[#007acc]">
          <span className="text-[#d4d4d4]">$</span> dev-wordle
        </h1>
        <p className="text-center text-[#6e7681] text-xs sm:text-sm font-mono px-12">
          <span className="text-[#4ec9b0]">//</span> Guess the 5-letter programming term
        </p>

        {/* Mode Toggle */}
        <div className="flex justify-center gap-2 mt-3 sm:mt-4">
          <button
            onClick={() => handleModeChange('daily')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded font-bold text-xs sm:text-sm transition-colors ${
              gameMode === 'daily'
                ? 'bg-[#007acc] text-white'
                : 'bg-[#3e3e42] text-[#6e7681] hover:bg-[#505053]'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => handleModeChange('practice')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded font-bold text-xs sm:text-sm transition-colors ${
              gameMode === 'practice'
                ? 'bg-[#007acc] text-white'
                : 'bg-[#3e3e42] text-[#6e7681] hover:bg-[#505053]'
            }`}
          >
            Practice
          </button>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col items-center justify-center gap-4 sm:gap-6 md:gap-8 w-full max-w-lg px-2">
        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-2 rounded text-sm sm:text-base max-w-xs sm:max-w-none text-center">
            {errorMessage}
          </div>
        )}

        {/* Game Grid */}
        <Grid
          guesses={state.guesses}
          currentGuess={state.currentGuess}
          answer={state.answer}
          currentRow={state.currentRow}
          isRevealing={isRevealing}
          isInvalid={isInvalid}
          isWinning={isWinning}
        />

        {/* Win/Loss Message */}
        {state.gameStatus !== 'playing' && (
          <div className="text-center">
            {state.gameStatus === 'won' ? (
              <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg">
                <p className="text-2xl font-bold mb-2">🎉 You Won!</p>
                <p className="text-sm">
                  You guessed the word in {state.guesses.length} {state.guesses.length === 1 ? 'try' : 'tries'}
                </p>
              </div>
            ) : (
              <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
                <p className="text-2xl font-bold mb-2">Game Over</p>
                <p className="text-sm">The word was: <span className="font-bold">{state.answer}</span></p>
              </div>
            )}
            <button
              onClick={handleNewGame}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-bold transition-colors"
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      {/* Keyboard */}
      <div className="w-full max-w-lg">
        <Keyboard onKeyPress={handleKeyPress} letterStates={keyboardStates} />
      </div>

      {/* Stats Modal */}
      {stats && (
        <StatsModal
          isOpen={showStats}
          onClose={() => setShowStats(false)}
          stats={stats}
          lastGame={
            state.gameStatus !== 'playing'
              ? {
                  guesses: state.guesses,
                  answer: state.answer,
                  won: state.gameStatus === 'won',
                }
              : undefined
          }
        />
      )}

      {/* Help Modal */}
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />

      {/* Word List Modal */}
      <WordListModal isOpen={showWordList} onClose={() => setShowWordList(false)} />
    </div>
  );
}
