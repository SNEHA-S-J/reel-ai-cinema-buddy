
import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MasonryGridProps {
  children: ReactNode;
  className?: string;
  columnCount?: number;
}

const MasonryGrid = ({ 
  children, 
  className,
  columnCount = 5
}: MasonryGridProps) => {
  const childrenArray = React.Children.toArray(children);
  const columns: ReactNode[][] = Array.from({ length: columnCount }, () => []);
  
  // Distribute children across columns
  childrenArray.forEach((child, index) => {
    const columnIndex = index % columnCount;
    columns[columnIndex].push(
      <div className="mb-4" key={index}>
        {child}
      </div>
    );
  });
  
  return (
    <div className={cn("w-full", className)}>
      <div className="flex gap-4">
        {columns.map((columnChildren, columnIndex) => (
          <div 
            key={columnIndex} 
            className="flex flex-col flex-1"
          >
            {columnChildren}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MasonryGrid;
