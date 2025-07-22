import { ReactNode } from 'react';

interface GoldButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

export default function GoldButton({ children, onClick, className = '' }: GoldButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-12 py-5 rounded-lg font-bold text-xl transition-all ${className}`}
      style={{
        background: 'linear-gradient(135deg, #fbbf24 0%, #fcd34d 50%, #f59e0b 100%)',
        color: '#1f2937',
        border: 'none',
        boxShadow: '0 4px 20px rgba(251, 191, 36, 0.3)',
      }}
    >
      {children}
    </button>
  );
}