"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

// Define the context type
interface WalletContextType {
  walletAddress: string;
  setWalletAddress: (address: string) => void;
  isConnected: boolean;
  setIsConnected: (isConnected: boolean) => void;
}

// Create the context with default values
const WalletContext = createContext<WalletContextType>({
  walletAddress: '',
  setWalletAddress: () => {},
  isConnected: false,
  setIsConnected: () => {},
});

// Create a provider component
export function WalletProvider({ children }: { children: ReactNode }) {
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);

  return (
    <WalletContext.Provider 
      value={{ 
        walletAddress, 
        setWalletAddress, 
        isConnected, 
        setIsConnected 
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

// Custom hook to use the wallet context
export function useWallet() {
  return useContext(WalletContext);
} 