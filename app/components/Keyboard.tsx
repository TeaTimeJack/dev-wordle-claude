import { LetterState } from '../lib/types';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  letterStates: Record<string, LetterState>;
}

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
];

export default function Keyboard({ onKeyPress, letterStates }: KeyboardProps) {
  const getKeyClasses = (key: string) => {
    if (key === 'ENTER' || key === '⌫') {
      return 'bg-[#3e3e42] text-[#d4d4d4] hover:bg-[#505053]';
    }

    const state = letterStates[key];
    switch (state) {
      case 'correct':
        return 'bg-[#4ec9b0] text-[#1e1e1e] hover:bg-[#6ed3c4]';
      case 'present':
        return 'bg-[#dcdcaa] text-[#1e1e1e] hover:bg-[#e6e4ba]';
      case 'absent':
        return 'bg-[#6e7681] text-[#d4d4d4] hover:bg-[#7e8691]';
      default:
        return 'bg-[#3e3e42] text-[#d4d4d4] hover:bg-[#505053]';
    }
  };

  const handleClick = (key: string) => {
    onKeyPress(key);
  };

  return (
    <div className="flex flex-col gap-1.5 sm:gap-2 items-center w-full max-w-lg mx-auto px-1">
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1 sm:gap-1.5 justify-center w-full">
          {row.map((key) => (
            <button
              key={key}
              onClick={() => handleClick(key)}
              className={`
                ${key === 'ENTER' || key === '⌫' ? 'px-2 sm:px-4 text-xs sm:text-sm' : 'px-1.5 sm:px-2 text-sm sm:text-base'}
                py-3 sm:py-4
                min-w-[28px] sm:min-w-[40px]
                rounded
                font-bold
                transition-all duration-100
                active:scale-95
                touch-manipulation
                ${getKeyClasses(key)}
              `}
            >
              {key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
