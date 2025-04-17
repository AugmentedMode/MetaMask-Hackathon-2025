import React from 'react';
import Link from 'next/link';

export interface TokenSwapData {
  url: string;
  message: string;
}

// Utility function to extract token info from a URL
const extractTokenInfoFromUrl = (url: string) => {
  try {
    const parsedUrl = new URL(url);
    const params = new URLSearchParams(parsedUrl.search);
    
    const inputCurrency = params.get('inputCurrency') || '';
    const outputCurrency = params.get('outputCurrency') || '';
    const exactAmount = params.get('exactAmount') || '';
    const exactField = params.get('exactField') || '';
    
    // Check for common token addresses and assign names
    const tokenNames: {[key: string]: {name: string, symbol: string}} = {
      '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE': { name: 'Shiba Inu', symbol: 'SHIB' },
      '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48': { name: 'USD Coin', symbol: 'USDC' },
      '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2': { name: 'Wrapped Ether', symbol: 'WETH' },
      '0xdAC17F958D2ee523a2206206994597C13D831ec7': { name: 'Tether', symbol: 'USDT' },
      '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984': { name: 'Uniswap', symbol: 'UNI' },
      '0x514910771af9ca656af840dff83e8264ecf986ca': { name: 'Chainlink', symbol: 'LINK' },
      '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0': { name: 'Polygon', symbol: 'MATIC' },
      'ETH': { name: 'Ethereum', symbol: 'ETH' },
    };
    
    const getTokenInfo = (address: string) => {
      if (address in tokenNames) {
        return tokenNames[address];
      }
      // For unknown tokens, show truncated address
      return {
        name: `${address.substring(0, 6)}...${address.substring(address.length - 4)}`,
        symbol: '???'
      };
    };
    
    const fromToken = getTokenInfo(inputCurrency);
    const toToken = getTokenInfo(outputCurrency);
    
    return {
      from: fromToken,
      to: toToken,
      amount: exactAmount,
      isExactInput: exactField === 'input'
    };
  } catch (e) {
    console.error('Failed to parse swap URL', e);
    return null;
  }
};

// Get logo image for common tokens
const getTokenLogo = (symbol: string) => {
  const logoMap: {[key: string]: string} = {
    'ETH': '/images/tokens/eth.svg',
    'WETH': '/images/tokens/eth.svg',
    'USDC': '/images/tokens/usdc.svg',
    'USDT': '/images/tokens/usdt.svg',
    'SHIB': '/images/tokens/shib.svg',
    'UNI': '/images/tokens/uni.svg',
    'LINK': '/images/tokens/link.svg',
    'MATIC': '/images/tokens/matic.svg',
  };
  
  // Return placeholder for unknown tokens
  return logoMap[symbol] || `https://ui-avatars.com/api/?name=${symbol}&background=random&size=60&length=3&bold=true&format=svg`;
};

const TokenSwapCard = ({ data }: { data: TokenSwapData }) => {
  const tokenInfo = extractTokenInfoFromUrl(data.url);
  
  if (!tokenInfo) {
    return (
      <div className="my-4 p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
        <div className="font-medium text-gray-700">Token Swap</div>
        <p className="text-sm text-gray-600 mt-2">{data.message}</p>
        <div className="mt-3">
          <Link 
            href={data.url}
            target="_blank"
            rel="noopener noreferrer" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Open Swap Link
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="my-6 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-1 rounded-xl shadow-lg">
        <div className="bg-white rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-800">Token Swap</h3>
            <div className="text-xs bg-blue-100 text-blue-800 py-1 px-2 rounded-full">
              Uniswap
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
            {/* From Token */}
            <div className="w-full md:w-2/5 bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">From</div>
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 relative">
                  <div className="h-full w-full rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                    <img 
                      src={getTokenLogo(tokenInfo.from.symbol)} 
                      alt={tokenInfo.from.symbol}
                      className="h-full w-full object-contain"
                      onError={(e) => { 
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${tokenInfo.from.symbol}&background=random&color=fff`; 
                      }}
                    />
                  </div>
                </div>
                <div className="ml-3">
                  <div className="font-medium">{tokenInfo.from.symbol}</div>
                  <div className="text-xs text-gray-500">{tokenInfo.from.name}</div>
                </div>
                {tokenInfo.isExactInput && tokenInfo.amount && (
                  <div className="ml-auto">
                    <div className="font-medium text-right">{tokenInfo.amount}</div>
                    <div className="text-xs text-gray-500">Amount</div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Swap Icon */}
            <div className="flex-shrink-0 flex items-center justify-center">
              <div className="bg-blue-100 rounded-full p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
            </div>
            
            {/* To Token */}
            <div className="w-full md:w-2/5 bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">To</div>
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 relative">
                  <div className="h-full w-full rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                    <img 
                      src={getTokenLogo(tokenInfo.to.symbol)} 
                      alt={tokenInfo.to.symbol}
                      className="h-full w-full object-contain"
                      onError={(e) => { 
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${tokenInfo.to.symbol}&background=random&color=fff`; 
                      }}
                    />
                  </div>
                </div>
                <div className="ml-3">
                  <div className="font-medium">{tokenInfo.to.symbol}</div>
                  <div className="text-xs text-gray-500">{tokenInfo.to.name}</div>
                </div>
                {!tokenInfo.isExactInput && tokenInfo.amount && (
                  <div className="ml-auto">
                    <div className="font-medium text-right">{tokenInfo.amount}</div>
                    <div className="text-xs text-gray-500">Amount</div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-center">
            <Link 
              href={data.url}
              target="_blank"
              rel="noopener noreferrer" 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Swap on Uniswap
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenSwapCard; 