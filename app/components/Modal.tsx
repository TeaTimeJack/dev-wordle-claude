import { ReactNode, useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      return () => window.removeEventListener('keydown', handleEsc);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center p-2 sm:p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-[#252526] border-2 border-[#3e3e42] rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 animate-slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[#007acc]">{title}</h2>
          <button
            onClick={onClose}
            className="text-[#d4d4d4] hover:text-white text-3xl sm:text-2xl leading-none p-1"
          >
            ×
          </button>
        </div>
        <div className="text-[#d4d4d4] text-sm sm:text-base">{children}</div>
      </div>
    </div>
  );
}
