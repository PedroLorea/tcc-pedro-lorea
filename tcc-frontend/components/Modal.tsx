"use client";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div
        className="
          bg-white rounded-2xl shadow-lg w-full max-w-2xl 
          max-h-[90vh] overflow-y-auto px-6 pb-6 relative
        "
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-white pb-2 border-b border-gray-200">
          {title && <h2 className="text-xl font-semibold text-roglio-blue pt-6">{title}</h2>}
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none cursor-pointer"
          >
            &times;
          </button>
        </div>

        {/* Conteúdo dinâmico */}
        <div className="overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
