import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Gas usage data types
interface GasUsageByType {
  count: number;
  total_usd: number;
  average_usd: number;
}

interface HighestGasTx {
  hash: string;
  gas_fee_usd: number;
  timestamp: string;
  type: string;
  chain: string;
}

export interface GasUsageData {
  total_gas_spent_usd: number;
  transaction_count: number;
  average_gas_per_tx_usd: number;
  highest_gas_tx: HighestGasTx;
  gas_by_type: {
    [key: string]: GasUsageByType;
  };
}

// Colors for the charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const GasUsageChart = ({ data }: { data: GasUsageData }) => {
  // Prepare data for the bar chart
  const barChartData = Object.entries(data.gas_by_type).map(([type, stats]) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    gasUsd: stats.total_usd,
    avgUsd: stats.average_usd,
    count: stats.count
  }));

  // Prepare data for the pie chart
  const pieChartData = Object.entries(data.gas_by_type).map(([type, stats]) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    value: stats.total_usd
  }));

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format a hash for display (truncated)
  const formatHash = (hash: string) => {
    if (hash.includes('...')) return hash; // Already formatted
    return hash.substring(0, 6) + '...' + hash.substring(hash.length - 4);
  };

  return (
    <div className="w-full mt-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Total Gas Spent</div>
          <div className="text-2xl font-semibold">${data.total_gas_spent_usd.toFixed(2)}</div>
          <div className="text-xs text-gray-400">{data.transaction_count} transactions</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Average Per Transaction</div>
          <div className="text-2xl font-semibold">${data.average_gas_per_tx_usd.toFixed(2)}</div>
          <div className="text-xs text-gray-400">per transaction</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Highest Transaction Fee</div>
          <div className="text-2xl font-semibold">${data.highest_gas_tx.gas_fee_usd.toFixed(2)}</div>
          <div className="text-xs text-gray-400">
            {data.highest_gas_tx.type} on {data.highest_gas_tx.chain}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bar chart for gas by type */}
        <div className="bg-white rounded-lg shadow p-4" style={{ height: '300px' }}>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Gas Costs by Transaction Type</h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value: any) => [`$${Number(value).toFixed(2)}`, 'Gas Cost']}
                labelFormatter={(label) => `${label}`}
              />
              <Legend />
              <Bar dataKey="gasUsd" name="Total Gas (USD)" fill="#0088FE" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart for distribution */}
        <div className="bg-white rounded-lg shadow p-4" style={{ height: '300px' }}>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Gas Distribution</h3>
          <ResponsiveContainer width="100%" height="85%">
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => `$${Number(value).toFixed(2)}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed transaction stats */}
      <div className="bg-white rounded-lg shadow p-4 mt-6">
        <h3 className="text-sm font-medium text-gray-500 mb-4">Transaction Details</h3>
        
        <h4 className="text-xs font-medium text-gray-500 mt-3 mb-2">Highest Gas Fee Transaction</h4>
        <div className="border-l-4 border-red-500 pl-3 py-1">
          <div className="flex flex-wrap justify-between">
            <div className="text-sm font-medium">{data.highest_gas_tx.type.charAt(0).toUpperCase() + data.highest_gas_tx.type.slice(1)} on {data.highest_gas_tx.chain}</div>
            <div className="text-sm font-bold text-red-500">${data.highest_gas_tx.gas_fee_usd.toFixed(2)}</div>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {formatDate(data.highest_gas_tx.timestamp)}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Tx: {formatHash(data.highest_gas_tx.hash)}
          </div>
        </div>
        
        <h4 className="text-xs font-medium text-gray-500 mt-4 mb-2">Transaction Types</h4>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-500 border-b">
              <th className="text-left pb-2">Type</th>
              <th className="text-center pb-2">Count</th>
              <th className="text-center pb-2">Total</th>
              <th className="text-right pb-2">Average</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(data.gas_by_type).map(([type, stats], index) => (
              <tr key={index} className="border-b border-gray-100 last:border-0">
                <td className="py-2">
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </td>
                <td className="text-center py-2">{stats.count}</td>
                <td className="text-center py-2">${stats.total_usd.toFixed(2)}</td>
                <td className="text-right py-2">${stats.average_usd.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GasUsageChart; 