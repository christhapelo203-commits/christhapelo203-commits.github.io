import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  headerAction?: React.ReactNode;
}

export default function Card({ children, className, title, description, headerAction }: CardProps) {
  return (
    <div className={cn("bg-[#1B263B] rounded-3xl border border-[#00C9A7]/5 shadow-sm overflow-hidden", className)}>
      {(title || description || headerAction) && (
        <div className="p-6 border-b border-[#00C9A7]/5 flex items-center justify-between gap-4">
          <div>
            {title && <h3 className="text-xl font-bold font-display">{title}</h3>}
            {description && <p className="text-sm text-[#F5F7FA]/40 font-medium mt-1 uppercase tracking-wider">{description}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}
