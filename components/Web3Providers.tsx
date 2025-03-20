"use client";

import { ReactNode } from 'react';

interface Web3ProvidersProps {
  children: ReactNode;
}

export function Web3Providers({ children }: Web3ProvidersProps) {
  return <>{children}</>;
} 