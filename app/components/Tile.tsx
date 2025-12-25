import { LetterState } from '../lib/types';

interface TileProps {
  letter: string;
  state: LetterState;
  isRevealing?: boolean;
  isInvalid?: boolean;
  isWinning?: boolean;
  revealDelay?: number;
}

export default function Tile({ letter, state, isRevealing = false, isInvalid = false, isWinning = false, revealDelay = 0 }: TileProps) {
  const getStateClasses = () => {
    switch (state) {
      case 'correct':
        return 'bg-[#4ec9b0] border-[#4ec9b0] text-[#1e1e1e]';
      case 'present':
        return 'bg-[#dcdcaa] border-[#dcdcaa] text-[#1e1e1e]';
      case 'absent':
        return 'bg-[#6e7681] border-[#6e7681] text-[#d4d4d4]';
      case 'current':
        return 'border-[#007acc] bg-[#252526]';
      case 'empty':
      default:
        return 'border-[#3e3e42] bg-[#252526]';
    }
  };

  return (
    <div
      className={`
        w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 md:w-[70px] md:h-[70px]
        border-2
        flex items-center justify-center
        text-xl xs:text-2xl sm:text-3xl font-bold uppercase font-mono
        transition-colors duration-200
        ${getStateClasses()}
        ${isRevealing ? 'tile-flip' : ''}
        ${isInvalid ? 'shake' : ''}
        ${isWinning ? 'bounce' : ''}
      `}
      style={{
        animationDelay: isRevealing ? `${revealDelay}ms` : '0ms',
      }}
    >
      {letter}
    </div>
  );
}
