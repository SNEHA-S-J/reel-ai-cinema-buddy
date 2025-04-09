
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
}

const Tooltip = ({ 
  content, 
  children, 
  position = 'top',
  className
}: TooltipProps) => {
  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 mb-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 translate-x-2 ml-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 translate-y-2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 -translate-x-2 mr-2',
  };

  return (
    <div className="tooltip-container">
      {children}
      <div className={cn(
        "tooltip",
        positionClasses[position],
        className
      )}>
        {content}
      </div>
    </div>
  );
};

export default Tooltip;
