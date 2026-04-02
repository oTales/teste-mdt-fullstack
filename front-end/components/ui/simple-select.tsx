'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SimpleSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
}

export const SimpleSelect = React.forwardRef<
  HTMLSelectElement,
  SimpleSelectProps
>(({ className, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
      className
    )}
    {...props}
  />
));

SimpleSelect.displayName = 'SimpleSelect';

