'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

import { CursorProvider } from '@/providers/CursorProvider';
import CustomCursor from '@/components/CustomCursor';

export function Providers({ children, customCursorEnabled = true }: { children: React.ReactNode, customCursorEnabled?: boolean }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <CursorProvider enabled={customCursorEnabled}>
        <CustomCursor />
        {children}
      </CursorProvider>
    </QueryClientProvider>
  );
}
