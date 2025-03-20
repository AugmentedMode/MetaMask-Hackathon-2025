"use client";

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { useWallet } from './WalletContext';

// Add TypeScript declarations for Ethereum provider
declare global {
  interface Window {
    ethereum: {
      request: (args: { method: string, params?: any[] }) => Promise<any>;
      on: (event: string, listener: (...args: any[]) => void) => void;
      removeListener: (event: string, listener: (...args: any[]) => void) => void;
    };
  }
}

export function ConnectWallet() {
  const [mounted, setMounted] = useState(false);
  const { walletAddress, setWalletAddress, isConnected, setIsConnected } = useWallet();

  // Handle connection with MetaMask
  const connectWallet = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        // Request accounts
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        // Set connected status and account address
        setIsConnected(true);
        setWalletAddress(accounts[0]);
      } catch (error) {
        console.error('Error connecting to MetaMask', error);
      }
    } else {
      alert('Please install MetaMask to use this feature');
    }
  };

  // Handle disconnection (Note: MetaMask doesn't really support programmatic disconnect)
  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress('');
  };

  // Listen for account changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected
          setIsConnected(false);
          setWalletAddress('');
        } else {
          // Account changed
          setIsConnected(true);
          setWalletAddress(accounts[0]);
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);

      // Check if already connected
      window.ethereum.request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            setIsConnected(true);
            setWalletAddress(accounts[0]);
          }
        })
        .catch(console.error);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, [setIsConnected, setWalletAddress]);

  // This is to prevent hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div>
      {isConnected ? (
        <Button 
          onClick={disconnectWallet}
          variant="outline"
        >
          {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
        </Button>
      ) : (
        <Button 
          onClick={connectWallet}
          variant="default"
        >
          Connect Wallet
        </Button>
      )}
    </div>
  );
} 