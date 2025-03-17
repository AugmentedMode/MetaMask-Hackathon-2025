"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { createConfig, WagmiConfig, useConnect, useDisconnect } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { http } from "wagmi";
import { injected } from "wagmi/connectors";
import { useWallet } from "@/utils/useWallet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client for react-query
const queryClient = new QueryClient();

// Set up wagmi config
const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
  connectors: [
    injected(),
  ],
});

// Wallet connect button component
export function WalletConnectButton() {
  const { isConnected, shortenedAddress } = useWallet();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const handleConnect = () => {
    connect({ connector: injected() });
  };

  const handleDisconnect = () => {
    disconnect();
  };

  return (
    <div>
      {isConnected ? (
        <Button 
          variant="outline" 
          size="default"
          onClick={handleDisconnect}
          className="flex items-center gap-2"
        >
          <span className="text-xs">{shortenedAddress}</span>
          <span>Disconnect</span>
        </Button>
      ) : (
        <Button 
          variant="outline" 
          size="default" 
          onClick={handleConnect}
          className="flex items-center gap-2"
        >
          <span>Connect Wallet</span>
        </Button>
      )}
    </div>
  );
}

// Wrapper component to provide wagmi context
export function WalletConnectProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={config}>
        {children}
      </WagmiConfig>
    </QueryClientProvider>
  );
}

export default WalletConnectButton; 