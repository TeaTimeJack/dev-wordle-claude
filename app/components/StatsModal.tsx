import Modal from './Modal';
import { GameStats } from '../lib/types';
import { getWinPercentage } from '../lib/stats';
import { checkGuess } from '../lib/gameLogic';
import { useState } from 'react';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: GameStats;
  lastGame?: {
    guesses: string[];
    answer: string;
    won: boolean;
  };
}

export default function StatsModal({ isOpen, onClose, stats, lastGame }: StatsModalProps) {
  const [copySuccess, setCopySuccess] = useState(false);

  const winPercentage = getWinPercentage(stats);
  const maxGuesses = Math.max(...stats.guessDistribution, 1);

  const generateShareText = () => {
    if (!lastGame) return '';

    const emoji = lastGame.guesses
      .map((guess) => {
        return checkGuess(guess, lastGame.answer)
          .map((state) => {
            if (state === 'correct') return '🟩';
            if (state === 'present') return '🟨';
            return '⬛';
          })
          .join('');
      })
      .join('\n');

    return `Dev Wordle ${lastGame.won ? lastGame.guesses.length : 'X'}/6\n\n${emoji}`;
  };

  const handleShare = async () => {
    const shareText = generateShareText();
    if (!shareText) return;

    try {
      await navigator.clipboard.writeText(shareText);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Statistics">
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-3 text-center">
          <div>
            <div className="text-3xl font-bold text-[#007acc]">{stats.gamesPlayed}</div>
            <div className="text-xs text-[#6e7681] uppercase">Played</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#4ec9b0]">{winPercentage}</div>
            <div className="text-xs text-[#6e7681] uppercase">Win %</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#dcdcaa]">{stats.currentStreak}</div>
            <div className="text-xs text-[#6e7681] uppercase">Current</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#dcdcaa]">{stats.maxStreak}</div>
            <div className="text-xs text-[#6e7681] uppercase">Max Streak</div>
          </div>
        </div>

        {/* Guess Distribution */}
        <div>
          <h3 className="text-sm font-bold mb-3 text-[#d4d4d4] uppercase">Guess Distribution</h3>
          <div className="space-y-1">
            {stats.guessDistribution.map((count, index) => {
              const percentage = maxGuesses > 0 ? (count / maxGuesses) * 100 : 0;
              const isLastGame = lastGame?.won && lastGame.guesses.length === index + 1;

              return (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-4 text-sm text-[#d4d4d4]">{index + 1}</div>
                  <div className="flex-1 flex items-center">
                    <div
                      className={`h-6 min-w-[2rem] px-2 flex items-center justify-end text-xs font-bold transition-all ${
                        isLastGame
                          ? 'bg-[#4ec9b0] text-[#1e1e1e]'
                          : 'bg-[#6e7681] text-[#d4d4d4]'
                      }`}
                      style={{
                        width: count > 0 ? `${Math.max(percentage, 10)}%` : '2rem',
                      }}
                    >
                      {count}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Share Button */}
        {lastGame && (
          <div className="pt-4 border-t border-[#3e3e42]">
            <button
              onClick={handleShare}
              className="w-full bg-[#007acc] hover:bg-[#1a8ccc] text-white font-bold py-3 px-4 rounded transition-colors"
            >
              {copySuccess ? '✓ Copied to Clipboard!' : 'Share Results'}
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
