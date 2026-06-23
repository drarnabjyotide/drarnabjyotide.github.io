import { cn } from '../../lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export default function Card({ children, className, onClick, hover = false, padding = 'md' }: CardProps) {
  const pad = { none: '', sm: 'p-3', md: 'p-4', lg: 'p-6' }[padding];
  return (
    <div
      className={cn(
        'card',
        pad,
        hover && 'hover:shadow-md hover:border-blue-200 cursor-pointer transition-all duration-200',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
