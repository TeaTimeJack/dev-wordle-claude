import Modal from './Modal';
import Tile from './Tile';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelpModal({ isOpen, onClose }: HelpModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="How to Play">
      <div className="space-y-4 text-sm">
        <p className="text-[#d4d4d4]">
          Guess the 5-letter programming term in 6 tries. Each guess must be a valid programming term.
        </p>

        <div className="space-y-3">
          <p className="font-bold text-[#4ec9b0]">// Examples:</p>

          {/* Example 1 - Correct letter in correct position */}
          <div>
            <div className="flex gap-1.5 mb-2">
              <Tile letter="A" state="correct" />
              <Tile letter="S" state="empty" />
              <Tile letter="Y" state="empty" />
              <Tile letter="N" state="empty" />
              <Tile letter="C" state="empty" />
            </div>
            <p className="text-[#6e7681]">
              <span className="text-[#4ec9b0] font-bold">A</span> is in the word and in the correct position.
            </p>
          </div>

          {/* Example 2 - Correct letter in wrong position */}
          <div>
            <div className="flex gap-1.5 mb-2">
              <Tile letter="S" state="empty" />
              <Tile letter="T" state="empty" />
              <Tile letter="A" state="present" />
              <Tile letter="C" state="empty" />
              <Tile letter="K" state="empty" />
            </div>
            <p className="text-[#6e7681]">
              <span className="text-[#dcdcaa] font-bold">A</span> is in the word but in the wrong position.
            </p>
          </div>

          {/* Example 3 - Letter not in word */}
          <div>
            <div className="flex gap-1.5 mb-2">
              <Tile letter="Q" state="empty" />
              <Tile letter="U" state="empty" />
              <Tile letter="E" state="empty" />
              <Tile letter="R" state="empty" />
              <Tile letter="Y" state="absent" />
            </div>
            <p className="text-[#6e7681]">
              <span className="text-[#6e7681] font-bold">Y</span> is not in the word in any position.
            </p>
          </div>
        </div>

        <div className="border-t border-[#3e3e42] pt-4 space-y-2">
          <p className="font-bold text-[#007acc]">Game Modes:</p>
          <ul className="list-disc list-inside space-y-1 text-[#6e7681]">
            <li><span className="font-bold text-[#d4d4d4]">Daily:</span> Same word for everyone, once per day</li>
            <li><span className="font-bold text-[#d4d4d4]">Practice:</span> Unlimited random words</li>
          </ul>
        </div>

        <div className="border-t border-[#3e3e42] pt-4">
          <p className="text-[#6e7681] italic">
            <span className="text-[#4ec9b0]">//</span> Good luck, developer! 🚀
          </p>
        </div>
      </div>
    </Modal>
  );
}
