import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// Portfolio balance type
export interface BalanceItem {
  address: string;
  balance: string;
  decimals: number;
  chainId: number;
  name: string;
  symbol: string;
  object: string;
}

export interface PortfolioData {
  balances: BalanceItem[];
  count: number;
  unprocessedNetworks: string[];
}

// Colors for the pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a64aff', '#ff4a4a', '#4affea', '#4a6eff'];

// Custom tooltip for the pie chart
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-200 shadow-sm rounded-md text-sm">
        <p className="font-medium">{`${payload[0].name}: ${payload[0].value.toLocaleString()}`}</p>
        <p className="text-gray-500 text-xs">{payload[0].payload.symbol}</p>
      </div>
    );
  }
  return null;
};

// Portfolio Chart Component
const PortfolioChart = ({ data }: { data: PortfolioData }) => {
  // Transform data for the pie chart
  const chartData = data.balances.map(item => ({
    name: item.name,
    symbol: item.symbol,
    value: parseFloat(item.balance),
    chainId: item.chainId,
    object: item.object
  }));

  return (
    <div className="w-full">
      <h3 className="text-lg font-medium mb-4 text-[#661700]">Portfolio Balances</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pie chart visualization */}
        <div className="bg-white rounded-lg shadow p-4 relative" style={{ height: '350px' }}>
          <div className="flex flex-col h-full">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Asset Distribution</h4>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        {/* Assets list */}
        <div className="bg-white rounded-lg shadow p-4">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Assets ({data.balances.length})</h4>
          <div className="overflow-y-auto max-h-[290px]">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-gray-500 border-b">
                  <th className="text-left pb-2">Asset</th>
                  <th className="text-right pb-2">Balance</th>
                </tr>
              </thead>
              <tbody>
                {data.balances.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 last:border-0">
                    <td className="py-2.5">
                      <div className="flex items-center">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center mr-2 text-white"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        >
                          {item.symbol.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium">{item.symbol}</div>
                          <div className="text-xs text-gray-500">{item.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-right py-2.5">
                      <div className="font-medium">{parseFloat(item.balance).toLocaleString()}</div>
                      <div className="text-xs text-gray-500">
                        {item.object === "native" ? "Native" : `Chain ID: ${item.chainId}`}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioChart; 