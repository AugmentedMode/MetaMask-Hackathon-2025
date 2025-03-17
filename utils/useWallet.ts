"use client";

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

export interface WalletInfo {
  address: string | undefined;
  isConnected: boolean;
  shortenedAddress: string | undefined;
}

export const useWallet = (): WalletInfo => {
  const { address, isConnected } = useAccount();
  const [shortenedAddress, setShortenedAddress] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (address) {
      // Format address to show only first 6 and last 4 characters
      setShortenedAddress(`${address.substring(0, 6)}...${address.substring(address.length - 4)}`);
    } else {
      setShortenedAddress(undefined);
    }
  }, [address]);

  return {
    address,
    isConnected,
    shortenedAddress
  };
};

export default useWallet; 