import React from 'react';
import Link from 'next/link';

export interface BridgeData {
  url: string;
  estimatedGas: string;
  estimatedTime: string;
  message: string;
  autoOpen?: boolean;
}

// Function to extract bridge info from URL
const extractBridgeInfo = (url: string) => {
  try {
    const parsedUrl = new URL(url);
    const params = new URLSearchParams(parsedUrl.search);
    
    const sourceToken = params.get('sourceToken') || '';
    const amount = params.get('amount') || '';
    const walletAddress = params.get('walletAddress') || '';
    
    // Determine source and destination networks from URL
    let sourceNetwork = 'Ethereum';
    let destNetwork = 'Unknown L2';
    
    if (url.includes('arbitrum')) {
      destNetwork = 'Arbitrum';
    } else if (url.includes('optimism')) {
      destNetwork = 'Optimism';
    } else if (url.includes('polygon')) {
      destNetwork = 'Polygon';
    } else if (url.includes('zksync')) {
      destNetwork = 'zkSync';
    } else if (url.includes('starknet')) {
      destNetwork = 'StarkNet';
    } else if (url.includes('base')) {
      destNetwork = 'Base';
    }
    
    return {
      sourceNetwork,
      destNetwork,
      sourceToken,
      amount,
      walletAddress: walletAddress ? 
        `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}` : 
        null
    };
  } catch (e) {
    console.error('Failed to parse bridge URL', e);
    return null;
  }
};

// Get network logo
const getNetworkLogo = (network: string) => {
  const logoMap: {[key: string]: string} = {
    'Ethereum': '/images/networks/ethereum.svg',
    'Arbitrum': '/images/networks/arbitrum.svg',
    'Optimism': '/images/networks/optimism.svg',
    'Polygon': '/images/networks/polygon.svg',
    'Base': '/images/networks/base.svg',
    'zkSync': '/images/networks/zksync.svg',
    'StarkNet': '/images/networks/starknet.svg',
  };
  
  // Return placeholder for unknown networks
  return logoMap[network] || `https://ui-avatars.com/api/?name=${network}&background=random&size=60&length=2&bold=true&format=svg`;
};

// Get token logo
const getTokenLogo = (symbol: string) => {
  const logoMap: {[key: string]: string} = {
    'ETH': '/images/tokens/eth.svg',
    'WETH': '/images/tokens/eth.svg',
    'USDC': '/images/tokens/usdc.svg',
    'USDT': '/images/tokens/usdt.svg',
  };
  
  // Return placeholder for unknown tokens
  return logoMap[symbol] || `https://ui-avatars.com/api/?name=${symbol}&background=random&size=60&length=3&bold=true&format=svg`;
};

const BridgeCard = ({ data }: { data: BridgeData }) => {
  const bridgeInfo = extractBridgeInfo(data.url);
  
  if (!bridgeInfo) {
    return (
      <div className="my-4 p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
        <div className="font-medium text-gray-700">Bridge to L2</div>
        <p className="text-sm text-gray-600 mt-2">{data.message}</p>
        <div className="mt-3">
          <Link 
            href={data.url}
            target="_blank"
            rel="noopener noreferrer" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Open Bridge
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="my-6 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-1 rounded-xl shadow-lg">
        <div className="bg-white rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-800">Bridge to {bridgeInfo.destNetwork}</h3>
            {bridgeInfo.walletAddress && (
              <div className="text-xs bg-gray-100 text-gray-600 py-1 px-2 rounded-full font-mono">
                {bridgeInfo.walletAddress}
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-start space-x-2 bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <div className="text-xs text-gray-500">Estimated Gas</div>
                <div className="font-medium">{data.estimatedGas}</div>
              </div>
            </div>
            
            <div className="flex items-start space-x-2 bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-xs text-gray-500">Estimated Time</div>
                <div className="font-medium">{data.estimatedTime}</div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-8 bg-gray-50 p-4 rounded-lg mb-4">
            {/* From Network */}
            <div className="w-full md:w-2/5 flex flex-col items-center">
              <div className="text-xs text-gray-500 mb-2">From</div>
              <div className="bg-white rounded-full p-3 shadow-sm mb-2">
                <img 
                  src={getNetworkLogo(bridgeInfo.sourceNetwork)} 
                  alt={bridgeInfo.sourceNetwork}
                  className="h-12 w-12"
                  onError={(e) => { 
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${bridgeInfo.sourceNetwork}&background=random&color=fff`; 
                  }}
                />
              </div>
              <div className="font-medium text-center">{bridgeInfo.sourceNetwork}</div>
            </div>
            
            {/* Bridge Amount */}
            <div className="flex flex-col items-center">
              <div className="relative mb-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-16 border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-white border-2 border-indigo-500">
                    <img 
                      src={getTokenLogo(bridgeInfo.sourceToken)} 
                      alt={bridgeInfo.sourceToken}
                      className="h-6 w-6"
                      onError={(e) => { 
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${bridgeInfo.sourceToken}&background=random&color=fff`; 
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="font-semibold text-xl text-indigo-600">
                {bridgeInfo.amount} {bridgeInfo.sourceToken}
              </div>
            </div>
            
            {/* To Network */}
            <div className="w-full md:w-2/5 flex flex-col items-center">
              <div className="text-xs text-gray-500 mb-2">To</div>
              <div className="bg-white rounded-full p-3 shadow-sm mb-2">
                <img 
                  src={getNetworkLogo(bridgeInfo.destNetwork)} 
                  alt={bridgeInfo.destNetwork}
                  className="h-12 w-12"
                  onError={(e) => { 
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${bridgeInfo.destNetwork}&background=random&color=fff`; 
                  }}
                />
              </div>
              <div className="font-medium text-center">{bridgeInfo.destNetwork}</div>
            </div>
          </div>
          
          <div className="mt-4 flex justify-center">
            <Link 
              href={data.url}
              target="_blank"
              rel="noopener noreferrer" 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
              </svg>
              Bridge to {bridgeInfo.destNetwork}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BridgeCard; 