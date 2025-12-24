import { GameStats } from './types';

const STATS_KEY = 'devWordle_stats';

const defaultStats: GameStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  maxStreak: 0,
  guessDistribution: [0, 0, 0, 0, 0, 0], // Indices 0-5 represent guesses 1-6
  lastPlayed: '',
};

/**
 * Load stats from localStorage
 */
export const loadStats = (): GameStats => {
  if (typeof window === 'undefined') return defaultStats;

  try {
    const stored = localStorage.getItem(STATS_KEY);
    if (!stored) return defaultStats;

    const parsed = JSON.parse(stored);

    // Validate structure
    if (
      typeof parsed.gamesPlayed === 'number' &&
      typeof parsed.gamesWon === 'number' &&
      Array.isArray(parsed.guessDistribution)
    ) {
      return {
        ...defaultStats,
        ...parsed,
      };
    }
  } catch (error) {
    console.error('Error loading stats:', error);
  }

  return defaultStats;
};

/**
 * Save stats to localStorage
 */
export const saveStats = (stats: GameStats): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error('Error saving stats:', error);
  }
};

/**
 * Update stats after a game ends
 */
export const updateStats = (
  currentStats: GameStats,
  won: boolean,
  guessCount: number
): GameStats => {
  const newStats = { ...currentStats };
  const today = new Date().toISOString().split('T')[0];

  // Update basic stats
  newStats.gamesPlayed += 1;
  newStats.lastPlayed = today;

  if (won) {
    newStats.gamesWon += 1;

    // Update guess distribution (guessCount is 1-6, array is 0-indexed)
    if (guessCount >= 1 && guessCount <= 6) {
      newStats.guessDistribution[guessCount - 1] += 1;
    }

    // Update streak
    const lastPlayedDate = new Date(currentStats.lastPlayed);
    const todayDate = new Date(today);
    const daysDiff = Math.floor(
      (todayDate.getTime() - lastPlayedDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff <= 1) {
      // Consecutive day or same day
      newStats.currentStreak += 1;
    } else {
      // Streak broken
      newStats.currentStreak = 1;
    }

    newStats.maxStreak = Math.max(newStats.maxStreak, newStats.currentStreak);
  } else {
    // Loss breaks streak
    newStats.currentStreak = 0;
  }

  saveStats(newStats);
  return newStats;
};

/**
 * Calculate win percentage
 */
export const getWinPercentage = (stats: GameStats): number => {
  if (stats.gamesPlayed === 0) return 0;
  return Math.round((stats.gamesWon / stats.gamesPlayed) * 100);
};

/**
 * Get the guess with the most wins
 */
export const getMostCommonGuessCount = (stats: GameStats): number => {
  let maxIndex = 0;
  let maxValue = stats.guessDistribution[0];

  for (let i = 1; i < stats.guessDistribution.length; i++) {
    if (stats.guessDistribution[i] > maxValue) {
      maxValue = stats.guessDistribution[i];
      maxIndex = i;
    }
  }

  return maxIndex + 1; // Convert back to 1-indexed
};
