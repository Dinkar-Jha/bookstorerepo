import React from 'react';

export interface SkeletonProps {
  className?: string;
  variant?: 'rectangular' | 'circular' | 'text';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  width,
  height
}) => {
  const variantStyles = {
    rectangular: 'rounded',
    circular: 'rounded-full',
    text: 'rounded h-4 my-1'
  };

  return (
    <div
      aria-hidden="true"
      className={`animate-pulse bg-book-stone-200 ${variantStyles[variant]} ${className}`}
      style={{
        width: width !== undefined ? (typeof width === 'number' ? `${width}px` : width) : undefined,
        height: height !== undefined ? (typeof height === 'number' ? `${height}px` : height) : undefined
      }}
    />
  );
};

export const BookCardSkeleton: React.FC = () => {
  return (
    <div className="bg-book-card border border-book-border rounded-lg p-4 flex flex-col gap-3 shadow-book-card">
      <Skeleton className="w-full aspect-[3/4] rounded-md" />
      <Skeleton variant="text" className="w-3/4 h-5 mt-1" />
      <Skeleton variant="text" className="w-1/2 h-3" />
      <div className="flex justify-between items-center mt-3 pt-3 border-t border-book-border">
        <Skeleton variant="text" className="w-16 h-5" />
        <Skeleton className="w-20 h-8 rounded" />
      </div>
    </div>
  );
};
