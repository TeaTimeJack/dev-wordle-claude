import Modal from './Modal';
import { ANSWER_WORDS, VALID_GUESSES } from '../lib/words';

interface WordListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WordListModal({ isOpen, onClose }: WordListModalProps) {
  // Get unique words from valid guesses that aren't in answer words
  const extraWords = VALID_GUESSES.filter(word => !ANSWER_WORDS.includes(word));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Word List">
      <div className="space-y-6">
        {/* Answer Words Section */}
        <div>
          <h3 className="text-lg font-bold text-[#4ec9b0] mb-3">
            <span className="text-[#d4d4d4]">//</span> Daily Challenge Words ({ANSWER_WORDS.length})
          </h3>
          <p className="text-xs text-[#6e7681] mb-3">
            These programming terms can appear as daily challenges
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {ANSWER_WORDS.map((word) => (
              <div
                key={word}
                className="bg-[#3e3e42] px-2 py-1.5 rounded text-center text-sm font-mono text-[#d4d4d4] hover:bg-[#505053] transition-colors"
              >
                {word}
              </div>
            ))}
          </div>
        </div>

        {/* Valid Guesses Section */}
        <div className="border-t border-[#3e3e42] pt-4">
          <h3 className="text-lg font-bold text-[#dcdcaa] mb-3">
            <span className="text-[#d4d4d4]">//</span> Additional Valid Words ({extraWords.length})
          </h3>
          <p className="text-xs text-[#6e7681] mb-3">
            These words are also accepted as valid guesses
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {extraWords.map((word) => (
              <div
                key={word}
                className="bg-[#252526] px-2 py-1.5 rounded text-center text-sm font-mono text-[#6e7681] hover:bg-[#3e3e42] transition-colors"
              >
                {word}
              </div>
            ))}
          </div>
        </div>

        {/* Total Count */}
        <div className="border-t border-[#3e3e42] pt-4 text-center">
          <p className="text-sm text-[#007acc]">
            <span className="font-bold">{VALID_GUESSES.length}</span> total programming terms available
          </p>
        </div>
      </div>
    </Modal>
  );
}
