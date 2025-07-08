import { useEffect, useState } from 'react';
import { CollaborativeUser } from '@/hooks/useCollaborativeSession';

interface CollaborativeCursorProps {
  user: CollaborativeUser;
  containerRef: React.RefObject<HTMLElement>;
}

export default function CollaborativeCursor({ user, containerRef }: CollaborativeCursorProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (user.cursor && containerRef.current) {
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      
      setPosition({
        x: user.cursor.x - rect.left,
        y: user.cursor.y - rect.top
      });
      setIsVisible(true);
      
      // Hide cursor after 3 seconds of inactivity
      const timeout = setTimeout(() => setIsVisible(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [user.cursor, containerRef]);

  if (!isVisible || !user.cursor) return null;

  return (
    <div
      className="fixed pointer-events-none z-50 transition-all duration-200"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-2px, -2px)'
      }}
    >
      {/* Cursor arrow */}
      <svg
        width="16"
        height="20"
        viewBox="0 0 16 20"
        fill="none"
        className="drop-shadow-lg"
      >
        <path
          d="M0 0L16 8L6 10L4 20L0 0Z"
          fill={user.color}
          stroke="white"
          strokeWidth="1"
        />
      </svg>
      
      {/* User name label */}
      <div
        className="absolute left-4 top-0 px-2 py-1 rounded text-xs font-medium text-white whitespace-nowrap"
        style={{ backgroundColor: user.color }}
      >
        {user.name}
      </div>
    </div>
  );
}